import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { BatchWriteCommand, DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { IFollowDao } from "../IDaoFactory";

const TABLE_NAME = 'follow';
const INDEX_NAME = 'follow-index';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'followeeAlias';

export class FollowDao implements IFollowDao{
  async isFollowing (followerAlias: string, followeeAlias: string) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  followerAlias,
            [SORT_KEY]: followeeAlias
        },
        ProjectionExpression: SORT_KEY
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => data.Item !== undefined)
  };
  async deleteFollow(alias: string, aliasToFollow: string) {
      // Set the parameters.
      const params = {
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [SORT_KEY]: aliasToFollow, // e.g. year: "2013"
        },
      };
      try {
        await ddbDocClient.send(new DeleteCommand(params));
      } catch (err) {
        throw err;
      }
    };
  async putFollow(alias: string, aliasToFollow: string) {
      // Set the parameters.
      const params = {
        TableName: TABLE_NAME,
        Item: {
          [PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [SORT_KEY]: aliasToFollow, // e.g. year: "2013"
        },
      };
      try {
        await ddbDocClient.send(new PutCommand(params));
      } catch (err) {
        throw err;
      }
    };
  async getDAOFollowersAliases(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[string[], boolean, string | null]> {
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
                [SORT_KEY]: { S: followeeAlias},
                [PRIMARY_KEY]: { S: lastFollowerAlias}
              }
      
            };
            console.log("get followers params other page\n" + JSON.stringify(params));
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
            console.log("get followers params first page\n" + JSON.stringify(params));
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
                      data.Items.forEach(s => {if (s[PRIMARY_KEY].S != undefined) items.push(s[PRIMARY_KEY].S)});
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
  
  
  async getDAOFolloweesAliases(followerAlias: string, limit: number, lastFolloweeAlias: string | null): Promise<[string[], boolean, string | null]> {
    let params;
    if(lastFolloweeAlias != undefined){
        params =  {
            KeyConditionExpression: PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followerAlias}
            },
            ProjectionExpression: SORT_KEY,
            TableName: TABLE_NAME,
            Limit: limit,
            ExclusiveStartKey: {
                [PRIMARY_KEY]: { S: followerAlias},
                [SORT_KEY]: { S: lastFolloweeAlias}
            }
    
          };
    }
    else{
        params =  {
            KeyConditionExpression: PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followerAlias}
            },
            ProjectionExpression: SORT_KEY,
            TableName: TABLE_NAME,
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
                    data.Items.forEach(s => {if (s[SORT_KEY].S != undefined) items.push(s[SORT_KEY].S)});
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
  
  
  //following functions not used in project, only used for data filling
  async createFollows(followeeAlias: string, followername: string, numUsers: number){
      // let aliasList: string[] = Array.from({length: numUsers}, (_, i) => followername + (i+1));
      
      let batchSize = 10;
      // console.log(aliasList.length);
      // console.log(aliasList.splice(2700, 100));
      // let aliasList = createArray(followername, 0, numUsers);
          // let list = aliasList.splice(i, batchSize);
          // console.log('list \n' + aliasList);
      for(let i = 0; i < numUsers; i+=batchSize){
          let aliasList = this.createArray(followername, i, batchSize);
          let list = aliasList;
          if(i > 1300){
              console.log('i ' + i);
              console.log('list \n' + list);
          }
          // let l = list.length;
          // console.log('number write items: ' + l)
          await this.createFollowsInBatches(followeeAlias, list);
          // execSync('sleep 0.1');
          // console.log( (i+batchSize) + ' followers created.')
      }
  }
  private createArray(followerName: string, start: number, batchSize: number){
      let aliasList = new Array<string>(batchSize);
      for(let i = 0; i < batchSize; ++i){
          aliasList[i] = followerName + (start+i+1);
      }
      return aliasList;
  }
  private async createFollowsInBatches(followeeAlias: string, followerAliasList: string[]){
      let length = followerAliasList.length;
      if(length == 0){
          console.log('zero followers to batch write');
          return true;
      }
      else{
          const params = {
              RequestItems: {
                [TABLE_NAME]: this.createPutFollowRequestBatch(followeeAlias, followerAliasList)
              }
            }
  
      await ddbDocClient.send(new BatchWriteCommand(params))
      return true;
      }
  }
  private createPutFollowRequestBatch(followeeAlias: string, followerAliasList: string[]){
      return followerAliasList.map(followerAlias => this.createPutFollowRequest(followerAlias, followeeAlias));
  }
  private createPutFollowRequest(followerAlias: string, followeeAlias: string){
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
}
