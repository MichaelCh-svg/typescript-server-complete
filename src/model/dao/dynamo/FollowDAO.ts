import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getEnvValue } from "../../../util/EnvString";

export class FollowDao{

  private TABLE_NAME = getEnvValue('FOLLOW_TABLE_NAME');
  private INDEX_NAME = getEnvValue('FOLLOW_INDEX_NAME');
  private PRIMARY_KEY = getEnvValue('FOLLOW_PRIMARY_KEY');
  private SORT_KEY = getEnvValue('FOLLOW_SORT_KEY');

  async isFollowing (followerAlias: string, followeeAlias: string) {
    console.log('follow dao follower ' + followerAlias + ' and followee ' + followeeAlias);
    const params = {
        TableName: this.TABLE_NAME,
        Key: {
            [this.PRIMARY_KEY]:  followerAlias,
            [this.SORT_KEY]: followeeAlias
        },
        ProjectionExpression: this.SORT_KEY
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => data.Item !== undefined)
  };
  async deleteFollow(alias: string, aliasToFollow: string) {
      // Set the parameters.
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          [this.PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [this.SORT_KEY]: aliasToFollow, // e.g. year: "2013"
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
        TableName: this.TABLE_NAME,
        Item: {
          [this.PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [this.SORT_KEY]: aliasToFollow, // e.g. year: "2013"
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
              KeyConditionExpression: this.SORT_KEY + " = :s",
              // FilterExpression: "contains (Subtitle, :topic)",
              ExpressionAttributeValues: {
                ":s": { S:  followeeAlias}
              },
              ProjectionExpression: this.PRIMARY_KEY,
              TableName: this.TABLE_NAME,
              IndexName: this.INDEX_NAME,
              Limit: limit,
              ExclusiveStartKey: {
                [this.SORT_KEY]: { S: followeeAlias},
                [this.PRIMARY_KEY]: { S: lastFollowerAlias}
              },
              ScanIndexForward: false
      
            };
            console.log("get followers params other page\n" + JSON.stringify(params));
      }
      else{
          params =  {
              KeyConditionExpression: this.SORT_KEY + " = :s",
              // FilterExpression: "contains (Subtitle, :topic)",
              ExpressionAttributeValues: {
                ":s": { S:  followeeAlias}
              },
              ProjectionExpression: this.PRIMARY_KEY,
              TableName: this.TABLE_NAME,
              IndexName: this.INDEX_NAME,
              Limit: limit, 
              ScanIndexForward: false
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
                      lastEvaluatedFollowerAlias = data.LastEvaluatedKey[this.PRIMARY_KEY].S;
                  }
                  else hasMorePages = false;
                 
                  
                  if(data.Items != undefined){
                      data.Items.forEach(s => {
                        let followerAlias = s[this.PRIMARY_KEY].S;
                        if (followerAlias != undefined) items.push(followerAlias)
                      });
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
            KeyConditionExpression: this.PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followerAlias}
            },
            ProjectionExpression: this.SORT_KEY,
            TableName: this.TABLE_NAME,
            Limit: limit,
            ExclusiveStartKey: {
                [this.PRIMARY_KEY]: { S: followerAlias},
                [this.SORT_KEY]: { S: lastFolloweeAlias}
            },
            ScanIndexForward: false
    
          };
    }
    else{
        params =  {
            KeyConditionExpression: this.PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  followerAlias}
            },
            ProjectionExpression: this.SORT_KEY,
            TableName: this.TABLE_NAME,
            Limit: limit, 
            ScanIndexForward: false
          };
    }
    
      let items : string[] = [];
      let hasMorePages = true;
      let lastEvaluatedFollowerAlias = null;
      let data;
        try {
            
            data = await ddbClient.send(new QueryCommand(params)).then(data => {
                if(data.LastEvaluatedKey != undefined){
                    lastEvaluatedFollowerAlias = data.LastEvaluatedKey[this.PRIMARY_KEY].S;
                }
                else hasMorePages = false;
               
                
                if(data.Items != undefined){
                    data.Items.forEach(s => {
                      let followeeAlias = s[this.SORT_KEY].S;
                      if (followeeAlias != undefined) items.push(followeeAlias)
                    });
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
  
}
