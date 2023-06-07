import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";
import { PutRequest } from "@aws-sdk/client-dynamodb";

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