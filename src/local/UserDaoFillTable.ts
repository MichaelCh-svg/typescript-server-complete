
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../model/dao/dynamo/ClientDynamo";
import { getEnvValue } from "../util/EnvString";
import { SHA256 } from "crypto-js";
import { execSync } from "child_process";
import { User } from "../model/entities";

export class UserDaoFillTable {

  private TABLE_NAME = getEnvValue('USER_TABLE_NAME');
  private PRIMARY_KEY = getEnvValue('USER_PRIMARY_KEY');
  private FIRST_NAME = getEnvValue('USER_FIRST_NAME');
  private LAST_NAME = getEnvValue('USER_LAST_NAME');
  private PASSWORD = getEnvValue('USER_PASSWORD');
  private IMAGE_URL = getEnvValue('USER_IMAGE_URL');
  private FOLLOWING_COUNT = getEnvValue('USER_FOLLOWING_COUNT');
  private FOLLOWERS_COUNT = getEnvValue('USER_FOLLOWERS_COUNT');  

  async createUsers(userList: User[], password: string){
    if(userList.length == 0){
      console.log('zero followers to batch write');
      return;
    }
    else{
      const hashedPassword = SHA256(password).toString();
      const params = {
        RequestItems: {
          [this.TABLE_NAME]: this.createPutUserRequestItems(userList, hashedPassword)
        }
      }
      await ddbDocClient.send(new BatchWriteCommand(params))
      .then(async (resp) => {
        await this.putUnprocessedItems(resp, params);
      })
      .catch(err => {
        throw new Error('Error while batchwriting users with params: '+ params + ": \n" + err);
    });;
    }
  }
  private createPutUserRequestItems(userList: User[], hashedPassword: string){
      return userList.map(user => this.createPutUserRequest(user, hashedPassword));
  }
  private createPutUserRequest(user: User, hashedPassword: string){
      let item = {
          [this.PRIMARY_KEY]: user.alias,
          [this.FIRST_NAME]: user.firstName,
          [this.LAST_NAME]: user.lastName,
          [this.PASSWORD]: hashedPassword,
          [this.IMAGE_URL]: user.imageUrl,
          [this.FOLLOWERS_COUNT]: 0,
          [this.FOLLOWING_COUNT]: 1
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
        while(Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
            //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
            // @ts-ignore 
            params.RequestItems = resp.UnprocessedItems;
            execSync('sleep ' + sec);
            if(sec < 1) sec += 0.1;
            await ddbDocClient.send(new BatchWriteCommand(params));
            if(resp.UnprocessedItems == undefined){
                break;
            }
        }
    }
  }
  increaseFollowersCount(alias: string, count: number){
    const params = {
      TableName: this.TABLE_NAME,
      Key: { [this.PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression: "SET " + this.FOLLOWERS_COUNT + " = " + this.FOLLOWERS_COUNT + ' + :inc'
    };
    ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
}




