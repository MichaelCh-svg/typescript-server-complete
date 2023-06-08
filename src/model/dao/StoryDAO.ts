import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { Status } from "../domain/Status";
import { StoryRequest } from "../net/request/StoryRequest";

const TABLE_NAME = 'story';
const PRIMARY_KEY = 'alias';
const SORT_KEY = 'timestamp';
const POST = 'post';

export async function getStatusList(request: StoryRequest): Promise<[Status[], boolean, string | null]> {
  let params;
  if(request.lastStatus != undefined){
      params =  {
          KeyConditionExpression: PRIMARY_KEY + " = :s",
          // FilterExpression: "contains (Subtitle, :topic)",
          ExpressionAttributeValues: {
            ":s": { S:  request.authorUser.alias}
          },
          TableName: TABLE_NAME,
          Limit: request.limit,
          ExclusiveStartKey: {
              [PRIMARY_KEY]: { S: request.lastStatus.user.alias},
              [SORT_KEY]: { N: request.lastStatus.timestamp}
          }
  
        };
  }
  else{
      // params =  {
      //     KeyConditionExpression: PRIMARY_KEY + " = :s",
      //     // FilterExpression: "contains (Subtitle, :topic)",
      //     ExpressionAttributeValues: {
      //       ":s": { S:  request.authorUser.alias}
      //     },
      //     TableName: TABLE_NAME,
      //     Limit: request.limit, 
      //   };
      params =  {
        KeyConditionExpression: [PRIMARY_KEY] + " = :s",
        ExpressionAttributeValues: {
          ":s": request.authorUser.alias
        },
        TableName: TABLE_NAME,
        Limit: 10, 
      };
      
  }
    console.log(JSON.stringify(params));
    let items : Status[] = [];
    let hasMorePages = true;
    let lastEvaluatedStatusAlias = null;
    let data;
      try {
          
          data = await ddbClient.send(new QueryCommand(params)).then(data => {
              if(data.LastEvaluatedKey != undefined){
                  lastEvaluatedStatusAlias = data.LastEvaluatedKey[PRIMARY_KEY].S;
              }
              else hasMorePages = false;
             
              
              if(data.Items != undefined){
                  // unfortunately, I can't use s.PRIMARY_KEY.S, because I can't use variables here.
                  // Instead we have to hardcode the value.
                  data.Items.forEach(s => {
                    items.push(new Status(s[POST], request.authorUser, s[SORT_KEY]))});
                  // data.Items.forEach(s => console.log(s.followerAlias.S))
              }
              if(items.length == 0) hasMorePages = false;
          });
      }
      catch (err) {
          throw err;
          };
    return [items, hasMorePages, lastEvaluatedStatusAlias];
        }
export async function putStory(alias: string, timestamp: number, post: string) {
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