import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { FakeData } from "../../util/FakeData";
import { User } from "../domain/User";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
const TABLE_NAME = 'follow';
const INDEX_NAME = 'follow-index';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'followeeAlias';

export async function getDAOFollowers(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[string[], boolean, string | null]> {
    let params;
    if(lastFollowerAlias != undefined){
        params =  {
            KeyConditionExpression: SORT_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followeeAlias}
            },
            ProjectionExpression: PRIMARY_KEY,
            TableName: TABLE_NAME,
            IndexName: INDEX_NAME,
            Limit: limit,
            ExclusiveStartKey: {
                [PRIMARY_KEY]: { S: lastFollowerAlias},
                [SORT_KEY]: { S: followeeAlias}
            }
    
          };
    }
    else{
        params =  {
            KeyConditionExpression: SORT_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followeeAlias}
            },
            ProjectionExpression: PRIMARY_KEY,
            TableName: TABLE_NAME,
            IndexName: INDEX_NAME,
            Limit: limit, 
          };
    }
    
      let items : string[] = [];
      let hasMorePages = true;
      let lastEvaluatedFollowerAlias = null;
      let data;
        try {
            
            data = await ddbClient.send(new QueryCommand(params)).then(data => {
                if(data.LastEvaluatedKey != undefined){
                    lastEvaluatedFollowerAlias = data.LastEvaluatedKey.followerAlias.S;
                }
                else hasMorePages = false;
               
                
                if(data.Items != undefined){
                    // unfortunately, I can't use s.PRIMARY_KEY.S, because I can't use variables here.
                    // Instead we have to hardcode the value.
                    data.Items.forEach(s => {if (s.followerAlias.S != undefined) items.push(s.followerAlias.S)});
                    // data.Items.forEach(s => console.log(s.followerAlias.S))
                }
                if(items.length == 0) hasMorePages = false;
            });
        }
        catch (err) {
            throw err;
            };
      return [items, hasMorePages, lastEvaluatedFollowerAlias];

   
        
}
export function getDAOFollowees(followerAlias: String | null, limit: number, lastFolloweeAlias: String | null) : [User[], boolean] {
    // try {
    //     const data = ddbClient.send(new QueryCommand(params)).then(data => {
    //         if(data.Items != undefined){
    //             data.Items.forEach(function (element) {
    //                 console.log(element.Title.S + " (" + element.Subtitle.S + ")");
    //               });
    //         } 
    //       });
    // }
    // catch (err) {
    //     throw err;
    //     };
        
    let fakeData = FakeData.instance;
    let allFollowees = fakeData.fakeUsers;

    let followeesIndex = lastFolloweeAlias == null ? 0 : allFollowees.findIndex(user => user.alias == lastFolloweeAlias);
    if(followeesIndex == -1) throw Error("Follower alias " + followerAlias + " not found.");
    
    let length = allFollowees.length;
    let remainingFolloweesCount = length - followeesIndex;
    let returnFolloweesCount = remainingFolloweesCount > 10 ? 10 : remainingFolloweesCount;

    let responseFollowees = allFollowees.splice(followeesIndex, followeesIndex + returnFolloweesCount);
    let hasMorePages = remainingFolloweesCount > limit;
    return [responseFollowees, hasMorePages];
}
export function getDAOFolloweesAliases(followerAlias: String | null, limit: number, lastFolloweeAlias: String | null) : [string[], boolean] {
    // try {
    //     const data = ddbClient.send(new QueryCommand(params)).then(data => {
    //         if(data.Items != undefined){
    //             data.Items.forEach(function (element) {
    //                 console.log(element.Title.S + " (" + element.Subtitle.S + ")");
    //               });
    //         } 
    //       });
    // }
    // catch (err) {
    //     throw err;
    //     };
        
    let fakeData = FakeData.instance;
    let allFollowees = fakeData.fakeUsers;

    let followeesIndex = lastFolloweeAlias == null ? 0 : allFollowees.findIndex(user => user.alias == lastFolloweeAlias);
    if(followeesIndex == -1) throw Error("Follower alias " + followerAlias + " not found.");
    
    let length = allFollowees.length;
    let remainingFolloweesCount = length - followeesIndex;
    let returnFolloweesCount = remainingFolloweesCount > 10 ? 10 : remainingFolloweesCount;

    let responseFollowees = allFollowees.splice(followeesIndex, followeesIndex + returnFolloweesCount);
    let followeeAliases = responseFollowees.map(u => u.alias);
    let hasMorePages = remainingFolloweesCount > limit;
    return [followeeAliases, hasMorePages];
}


//following functions not used in project, only used for data filling
export async function createFollows(followeeAlias: string, followerAliasList: string[]){
    const params = {
                  RequestItems: {
                    [TABLE_NAME]: createPutFollowRequestBatch(followeeAlias, followerAliasList)
                  }
                }

    await ddbDocClient.send(new BatchWriteCommand(params))
}
function createPutFollowRequestBatch(followeeAlias: string, followerAliasList: string[]){
    return followerAliasList.map(followerAlias => createPutFollowRequest(followerAlias, followeeAlias));
}
function createPutFollowRequest(followerAlias: string, followeeAlias: string){
    let item = {
        [PRIMARY_KEY]: followerAlias,
        [SORT_KEY]: followeeAlias,
    }
    let request = {
        PutRequest: {
            Item: item
        }
    }
    return request;
}