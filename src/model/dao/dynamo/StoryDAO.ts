import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { getEnvValue } from "../../../util/EnvString";
import { Status, User } from "../../entities";


export class StoryDao{

  private TABLE_NAME = getEnvValue('STORY_TABLE_NAME');
  private PRIMARY_KEY = getEnvValue('STORY_PRIMARY_KEY');
  private SORT_KEY = getEnvValue('STORY_SORT_KEY');
  private POST = getEnvValue('STORY_POST');
  async getStatusList(authorUser: User, limit: number, lastStatus: Status | null): Promise<[Status[], boolean]> {
    let params;
    if(lastStatus != undefined){
        params =  {
            KeyConditionExpression: this.PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": authorUser.alias
            },
            TableName: this.TABLE_NAME,
            Limit: limit,
            ExclusiveStartKey: {
                [this.PRIMARY_KEY]: lastStatus.user.alias,
                [this.SORT_KEY]: lastStatus.timestamp
            },
            ScanIndexForward: false
    
          };
    }
    else{
        params =  {
          KeyConditionExpression: [this.PRIMARY_KEY] + " = :s",
          ExpressionAttributeValues: {
            ":s": authorUser.alias
          },
          TableName: this.TABLE_NAME,
          Limit: 10, 
          ScanIndexForward: false
        };
        
    }
      // console.log(JSON.stringify(params));
      let items : Status[] = [];
      let hasMorePages = true;
      let data;
        try {
            
            data = await ddbClient.send(new QueryCommand(params)).then(data => {
                
               
                if(data.Items != undefined && data.Items.length > 0){
                    data.Items.forEach(s => {
                      items.push(new Status(s[this.POST], authorUser, s[this.SORT_KEY]))});
                    // data.Items.forEach(s => console.log(s.followerAlias.S))
                }
                if(items.length == 0) hasMorePages = false;
                if(data.LastEvaluatedKey == undefined){
                  hasMorePages = false
                }
                else console.log(data.LastEvaluatedKey);
              });
        }
        catch (err) {
            throw err;
            };
      return [items, hasMorePages];
          }
  async putStory(alias: string, timestamp: number, post: string) {
      // Set the parameters.
      const params = {
        TableName: this.TABLE_NAME,
        Item: {
          [this.PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [this.SORT_KEY]: timestamp, // e.g. year: "2013"
          [this.POST]: post,
        },
      };
      try {
        await ddbDocClient.send(new PutCommand(params)).then(j => j);
      } catch (err) {
        throw err;
      }
    };
}

