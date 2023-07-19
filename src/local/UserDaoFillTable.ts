
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../model/dao/dynamo/ClientDynamo";
import { getEnvValue } from "../util/EnvString";
import { SHA256 } from "crypto-js";
import { execSync } from "child_process";
import { User } from "../model/entities";


const TABLE_NAME = getEnvValue('USER_TABLE_NAME');
const PRIMARY_KEY = getEnvValue('USER_PRIMARY_KEY');
const FIRST_NAME = getEnvValue('USER_FIRST_NAME');
const LAST_NAME = getEnvValue('USER_LAST_NAME');
const PASSWORD = getEnvValue('USER_PASSWORD');
const IMAGE_URL = getEnvValue('USER_IMAGE_URL');
const FOLLOWING_COUNT = getEnvValue('USER_FOLLOWING_COUNT');
const FOLLOWERS_COUNT = getEnvValue('USER_FOLLOWERS_COUNT');

export class UserDaoFillTable {
  
  
    //following functions not used by the application, but for setting up the data
  
    async createUsers(userList: User[], password: string){
      const hashedPassword = SHA256(password).toString();
      const params = {
                    RequestItems: {
                      [TABLE_NAME]: this.createPutUserRequestBatch(userList, hashedPassword)
                    }
                  }
      let wait = true;
      await ddbDocClient.send(new BatchWriteCommand(params)).then(async (resp) => {
        await this.putUnprocessedItems(resp, params);
        wait = false;
    });
    //   while(wait){}
  }
  createPutUserRequestBatch(userList: User[], hashedPassword: string){
      return userList.map(user => this.createPutUserRequest(user, hashedPassword));
  }
  createPutUserRequest(user: User, hashedPassword: string){
      let item = {
          [PRIMARY_KEY]: user.alias,
          [FIRST_NAME]: user.firstName,
          [LAST_NAME]: user.lastName,
          [PASSWORD]: hashedPassword,
          [IMAGE_URL]: user.imageUrl,
          [FOLLOWERS_COUNT]: 0,
          [FOLLOWING_COUNT]: 1
      }
      let request = {
          PutRequest: {
              Item: item
          }
      }
      return request;
  }

  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput){
    if(resp.UnprocessedItems != undefined){
        let sec = 0.01;
        let wait;
        while(Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
            //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
            // @ts-ignore 
            params.RequestItems = resp.UnprocessedItems;
            console.log(params);
            execSync('sleep ' + sec);
            if(sec < 1) sec += 0.1;
            wait = true;
            await ddbDocClient.send(new BatchWriteCommand(params)).then(() => wait = false);
            // while(wait){}
            console.log('batch wrote the user unprocessed items')
            if(resp.UnprocessedItems == undefined){
                break;
            }
        }
    }
  }
  increaseFollowersCount(alias: string, count: number){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression: "SET " + FOLLOWERS_COUNT + " = " + FOLLOWERS_COUNT + ' + :inc'
    };
    ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
}




