import { BatchWriteCommand, DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getEnvValue } from "../../../util/EnvString";
import { ITokenDao } from "../IDaoFactory";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { AuthToken } from "../../entities";

const TABLE_NAME = getEnvValue('TOKEN_TABLE_NAME');
const PRIMARY_KEY = getEnvValue('TOKEN_PRIMARY_KEY');
const TIMESTAMP = getEnvValue('TOKEN_TIMESTAMP');
const USERNAME = getEnvValue('TOKEN_USERNAME');


export class TokenDao implements ITokenDao{
    async deleteToken(token: String): Promise<void> {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: token
        },
      };
      try {
        await ddbDocClient.send(new DeleteCommand(params));
      } catch (err) {
        throw err;
      }
    }
    async clearExpiredTokens(expireTimeInMinutes: number): Promise<void> {
      let tokens: string[] = await this.getExpiredTokens(expireTimeInMinutes);
      await this.deleteExpiredTokens(tokens);

    }
    private async deleteExpiredTokens(tokens: string[]): Promise<void> {
      if(tokens.length == 0) return;
      else{
        // you can't send more than 25 items in a batchwrite request
        for(let i = 0; i < tokens.length; i += 25){
          // make sure to not get slice mixed up with splice, as splice changes the original array
          let tokenBatch = tokens.slice(i, i+25);
          const params = {
            RequestItems: {
                [TABLE_NAME]: tokenBatch.map(token => this.createDeleteTokenRequest(token))
            }
            }
            // console.log(JSON.stringify(params));  
          let resp = await ddbDocClient.send(new BatchWriteCommand(params));
          if(resp.UnprocessedItems != undefined){
            let ms = 1000;
            
            while(Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems[TABLE_NAME]).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
                // @ts-ignore 
                params.RequestItems = resp.UnprocessedItems;
                console.log(params);
                await this.sleep(ms);
                if(ms < 10000) ms+=100;
                resp = await ddbDocClient.send(new BatchWriteCommand(params));
                console.log('batch wrote the unprocessed items')
                if(resp.UnprocessedItems == undefined){
                    break;
                }
            }
        }
        }

      }
    }
    private sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    private async getExpiredTokens(expireTimeInMinutes: number): Promise<string[]> {
      let expireTimeInMs = expireTimeInMinutes * 60 * 1000;
      // console.log(moment(Date.now()).format("DD-MMM-YYYY HH:mm:ss"));
      let expireTimeStamp = Date.now() - expireTimeInMs;
      // console.log(moment(expireTimeStamp).format("DD-MMM-YYYY HH:mm:ss"));
      let params =  {
        FilterExpression: "#attr < :t",
        ExpressionAttributeNames: {
          "#attr": TIMESTAMP
      },
        ExpressionAttributeValues: {
          ":t": expireTimeStamp
        },
        TableName: TABLE_NAME
      };
      // console.log(params);
      let resp = await ddbClient.send(new ScanCommand(params));
      // console.log(resp);
      let tokens: string[] = resp.Items == undefined ? [] : resp.Items.map(item => item[PRIMARY_KEY] as string);
      return tokens;
    }
    async getToken(token: string): Promise<[AuthToken, string] | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]:  token
            }
        };
        // console.log('get token params ' + JSON.stringify(params));
        return await ddbDocClient.send(new GetCommand(params)).then(data => {
          if(data.Item === undefined) return null;
          else return [new AuthToken(data.Item[PRIMARY_KEY], data.Item[TIMESTAMP]), data.Item[USERNAME]]; });
    }
    async updateTokenTimestamp(token: string, timestamp: number): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Key: { [PRIMARY_KEY]: token},
            UpdateExpression: "SET #attr = :v",

            // since 'timestamp' is a reserved keyword, it has to be passed in as 
            // an expressionattributename and cannot be passed in directly to the updateexpression
            ExpressionAttributeNames: {
              "#attr": TIMESTAMP
          },
            ExpressionAttributeValues: {
              ":v": timestamp
          }
          };
          console.log('update token params ' + JSON.stringify(params));
          return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
              return;});
    }
    async putToken(token: AuthToken, username: string): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Item: {
              [PRIMARY_KEY]: token.token, //e.g. title: "Rush"
              [TIMESTAMP]: token.timestamp, // e.g. year: "2013"
              [USERNAME]: username
            },
          };
          try {
            await ddbDocClient.send(new PutCommand(params));
          } catch (err) {
            throw err;
          }
    }
    private createDeleteTokenRequest(token: string){

      let request = {
          DeleteRequest: {
              Key : { [PRIMARY_KEY]: token}
          }
      }
      return request;
  }
    
}