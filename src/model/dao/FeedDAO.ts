import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

const TABLE_NAME = 'feed';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'timestamp';
const AUTHOR_ALIAS = 'authorAlias';
const POST = 'post';

export async function getFeedStatusListWithoutUsers(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean, Status | null]> {
    let params;
    if(lastStatus != undefined){
        params =  {
            KeyConditionExpression: PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  alias}
            },
            TableName: TABLE_NAME,
            Limit: limit,
            ExclusiveStartKey: {
                [PRIMARY_KEY]: { S: lastStatus.user.alias},
                [SORT_KEY]: { N: lastStatus.timestamp}
            }
    
          };
    }
    else{
        params =  {
          KeyConditionExpression: [PRIMARY_KEY] + " = :s",
          ExpressionAttributeValues: {
            ":s": alias
          },
          TableName: TABLE_NAME,
          Limit: 10, 
        };
        
    }
      console.log(JSON.stringify(params));
      let items : Status[] = [];
      let hasMorePages = true;
      let lastEvaluatedStatus = null;
      let data;
        try {
            
            data = await ddbClient.send(new QueryCommand(params)).then(data => {
                
                if(data.Items != undefined && data.Items.length > 0){
                    data.Items.forEach(s => {
                      items.push(new Status(s[POST], new User('undefined', 'undefined', s[AUTHOR_ALIAS], 'undefined'), s[SORT_KEY]))});
                }
                if(items.length == 0) hasMorePages = false;
                if(data.LastEvaluatedKey != undefined){
                    lastEvaluatedStatus =  items.findLast;
                }
                else hasMorePages = false;
            });
        }
        catch (err) {
            throw err;
            };
      return [items, hasMorePages, lastEvaluatedStatus];
          }

export async function putFeeds(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
    // trying to batchwrite zero items throws an error
    let length = followersAliases.length;
    let batchSize = 10;
    console.log(followersAliases.length + ' followers');
    for(let i = 0; i < length; i+=batchSize){
        await putFeedsInBatches(authorAlias, post, followersAliases.slice(i, i+batchSize), timestamp);
    }
}
export async function putFeedsInBatches(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
    // trying to batchwrite zero items throws an error
    if(followersAliases.length == 0) return;
    // console.log(followersAliases + ' followersAliases');
    const params = {
                  RequestItems: {
                    [TABLE_NAME]: createPutFeedRequestBatch(post, authorAlias, followersAliases, timestamp)
                  }
                }

    let resp = await ddbDocClient.send(new BatchWriteCommand(params))
    if(resp.UnprocessedItems != undefined){
        let ms = 1000;
        while(Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
            //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
            // @ts-ignore 
            params.RequestItems = resp.UnprocessedItems;
              console.log(params);
            await sleep(ms);
            if(ms < 10000) ms+=100;
            resp = await ddbDocClient.send(new BatchWriteCommand(params));
            console.log('batch wrote the unprocessed items')
            if(resp.UnprocessedItems == undefined){
                break;
            }
        }
    }
   }
   function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function createPutFeedRequestBatch(post: string, authorAlias: string, followerAliases: string[], timestamp: number){
    return followerAliases.map(follower => createPutFeedRequest(post, authorAlias, follower, timestamp));
}
function createPutFeedRequest(post: string, authorAlias: string, followeeAlias: string, timestamp: number){
    let item = {
        [PRIMARY_KEY]: followeeAlias,
        [SORT_KEY]: timestamp,
        [AUTHOR_ALIAS]: authorAlias,
        [POST]: post
    }
    let request = {
        PutRequest: {
            Item: item
        }
    }
    return request;
}