import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getEnvValue } from "../../../util/EnvString";
import { AuthToken } from "../../domain/AuthToken";
import { ITokenDao } from "../IDaoFactory";
import { ddbDocClient } from "./ClientDynamo";

const TABLE_NAME = getEnvValue('TOKEN_TABLE_NAME');
const PRIMARY_KEY = getEnvValue('TOKEN_PRIMARY_KEY');
const TIMESTAMP = getEnvValue('TOKEN_TIMESTAMP');


export class TokenDao implements ITokenDao{
    async getToken(token: string): Promise<AuthToken | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]:  token,
            }
        };
        return await ddbDocClient.send(new GetCommand(params)).then(data => {
          if(data.Item === undefined) return null;
          else return new AuthToken(data.Item[PRIMARY_KEY], data.Item[TIMESTAMP]); });
    }
    async updateTokenTimestamp(token: string, timestamp: number): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Key: { [PRIMARY_KEY]: token},
            UpdateExpression: "SET " + TIMESTAMP + " = " + timestamp
          };
          return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
              return;});
    }
    async putToken(token: AuthToken): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Item: {
              [PRIMARY_KEY]: token.token, //e.g. title: "Rush"
              [TIMESTAMP]: token.datetime, // e.g. year: "2013"
            },
          };
          try {
            await ddbDocClient.send(new PutCommand(params));
          } catch (err) {
            throw err;
          }
    }
    
}