import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { StatusListRequest } from "../net/request/StatusListRequest";
import { User } from "../../domain/User";

const TABLE_NAME = 'story';
const PRIMARY_KEY = 'alias';
const SORT_KEY = 'timestamp';
const POST = 'post';

export class StoryDao{
  async getStatusList(authorUser: User, limit: number, lastStatus: Status | null): Promise<[Status[], boolean]> {
    let params;
    if(lastStatus != undefined){
        params =  {
            KeyConditionExpression: PRIMARY_KEY + " = :s",
            // FilterExpression: "contains (Subtitle, :topic)",
            ExpressionAttributeValues: {
              ":s": { S:  authorUser.alias}
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
            ":s": authorUser.alias
          },
          TableName: TABLE_NAME,
          Limit: 10, 
        };
        
    }
      console.log(JSON.stringify(params));
      let items : Status[] = [];
      let hasMorePages = true;
      let data;
        try {
            
            data = await ddbClient.send(new QueryCommand(params)).then(data => {
                
               
                if(data.Items != undefined && data.Items.length > 0){
                    data.Items.forEach(s => {
                      items.push(new Status(s[POST], authorUser, s[SORT_KEY]))});
                    // data.Items.forEach(s => console.log(s.followerAlias.S))
                }
                if(items.length == 0) hasMorePages = false;
                if(data.LastEvaluatedKey == undefined){
                  hasMorePages = false
              }
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
        TableName: TABLE_NAME,
        Item: {
          [PRIMARY_KEY]: alias, //e.g. title: "Rush"
          [SORT_KEY]: timestamp, // e.g. year: "2013"
          [POST]: post,
        },
      };
      try {
        await ddbDocClient.send(new PutCommand(params)).then(j => j);
      } catch (err) {
        throw err;
      }
    };
}

