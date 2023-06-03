import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";

const TABLE_NAME = 'feed';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'timestamp';
const AUTHOR_ALIAS = 'authorAlias';
const POST = 'post';

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
        console.log('unprocessed items ' + Object.keys(resp.UnprocessedItems));
        while(Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(resp.UnprocessedItems.data.length + ' unprocessed items');
            const params2 = {
                RequestItems: {
                  [TABLE_NAME]: Object.keys(resp.UnprocessedItems)
                }
              }
            resp = await ddbDocClient.send(new BatchWriteCommand(params2));
            if(resp.UnprocessedItems == undefined){
                break;
            }
        }
    }
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