import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../model/dao/dynamo/ClientDynamo";
import { getEnvValue } from "../util/EnvString";
import { execSync } from "child_process";

export class FollowDaoFillTable {
  private TABLE_NAME = getEnvValue('FOLLOW_TABLE_NAME');
  private INDEX_NAME = getEnvValue('FOLLOW_INDEX_NAME');
  private PRIMARY_KEY = getEnvValue('FOLLOW_PRIMARY_KEY');
  private SORT_KEY = getEnvValue('FOLLOW_SORT_KEY');
  
  
  //following functions not used in project, only used for data filling
 
  async createFollowsInBatches(followeeAlias: string, followerAliasList: string[]){
      let length = followerAliasList.length;
      if(length == 0){
          console.log('zero followers to batch write');
          return true;
      }
      else{
        let requestItems = this.createPutFollowRequestBatch(followeeAlias, followerAliasList);
          const params = {
              RequestItems: {
                [this.TABLE_NAME]: requestItems
              }
            }
  
      let wait = true;
      try{
        // console.log('params' + JSON.stringify(params));
        let success = await ddbDocClient.send(new BatchWriteCommand(params)).then(async (resp)=>{
            // console.log('followers sent, executing then clause');
            await this.putUnprocessedItems(resp, params, 0);
            wait = false;
            return true;
        })
        .catch(err => {
            console.log('error while batchwriting follows ' + err);
            // console.log('params ' + JSON.stringify(params));
            return false;
        });
      }
      catch(err){
        console.log('error when batch putting follows with params \n' + JSON.stringify(params));
      }
      
    //   while(wait){}
      }
  }
  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number){
    // console.log('putting unprocessed items with resp ' + JSON.stringify(resp));
    // console.log('putting unprocessed items with params ' + JSON.stringify(params));
    if(attempts > 1) console.log(attempts + 'th attempt starting');
;    if(resp.UnprocessedItems != undefined){
        let sec = 0.03;
        let wait;
        if (Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
            //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
            // @ts-ignore 
            params.RequestItems = resp.UnprocessedItems;
            execSync('sleep ' + sec);
            if(sec < 10) sec += 0.1;
            wait = true;
            await ddbDocClient.send(new BatchWriteCommand(params)).then(async (innerResp) => {
                wait = false
                if(innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0){
                    params.RequestItems = innerResp.UnprocessedItems;
                    ++attempts
                    await this.putUnprocessedItems(innerResp, params, attempts)
                    // console.log('unprocessed items response ' + JSON.stringify(resp));
            }
            }).catch(err => {
                console.log('error while batch writing unprocessed items ' + err);
            });
            // while(wait){}
            
        }
    }
  }
  private createPutFollowRequestBatch(followeeAlias: string, followerAliasList: string[]){
      let follwerAliasList = followerAliasList.map(followerAlias => this.createPutFollowRequest(followerAlias, followeeAlias));
      return follwerAliasList;
  }
  private createPutFollowRequest(followerAlias: string, followeeAlias: string){
      let item = {
          [this.PRIMARY_KEY]: followerAlias,
          [this.SORT_KEY]: followeeAlias,
      }
      let request = {
          PutRequest: {
              Item: item
          }
      }
      return request;
  }
}
