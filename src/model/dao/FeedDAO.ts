import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";

const TABLE_NAME = 'feed';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'timestamp';
const AUTHOR_ALIAS = 'authorAlias';
const POST = 'post';

export async function putFeeds(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
    // trying to batchwrite zero items throws an error
    if(followersAliases.length == 0) return;
    const params = {
                  RequestItems: {
                    [TABLE_NAME]: createPutFeedRequestBatch(post, authorAlias, followersAliases, timestamp)
                  }
                }

    await ddbDocClient.send(new BatchWriteCommand(params))
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