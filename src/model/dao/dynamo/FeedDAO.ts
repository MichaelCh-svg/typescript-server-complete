import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { IFeedDao } from "../IDaoFactory";

export class FeedDao implements IFeedDao{
    private TABLE_NAME = 'feed';
    private PRIMARY_KEY = 'followerAlias';
    private SORT_KEY = 'timestamp';
    private AUTHOR_ALIAS = 'authorAlias';
    private POST = 'post';

    async getFeedStatusListWithoutUsers(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean, Status | null]> {
        let params;
        if(lastStatus != undefined){
            params =  {
                KeyConditionExpression: this.PRIMARY_KEY + " = :s",
                // FilterExpression: "contains (Subtitle, :topic)",
                ExpressionAttributeValues: {
                ":s": { S:  alias}
                },
                TableName: this.TABLE_NAME,
                Limit: limit,
                ExclusiveStartKey: {
                    [this.PRIMARY_KEY]: { S: lastStatus.user.alias},
                    [this.SORT_KEY]: { N: lastStatus.timestamp}
                }
        
            };
        }
        else{
            params =  {
            KeyConditionExpression: [this.PRIMARY_KEY] + " = :s",
            ExpressionAttributeValues: {
                ":s": alias
            },
            TableName: this.TABLE_NAME,
            Limit: 10, 
            };
            
        }
        console.log(JSON.stringify(params));
        let items : Status[] = [];
        let hasMorePages = true;
        let lastEvaluatedStatus = null;
        let data;
            try {
                
                data = await ddbClient.send(new QueryCommand(params)).then(data => {
                    
                    if(data.Items != undefined && data.Items.length > 0){
                        data.Items.forEach(s => {
                        items.push(new Status(s[this.POST], new User('undefined', 'undefined', s[this.AUTHOR_ALIAS], 'undefined'), s[this.SORT_KEY]))});
                    }
                    if(items.length == 0) hasMorePages = false;
                    if(data.LastEvaluatedKey != undefined){
                        lastEvaluatedStatus =  items.findLast;
                    }
                    else hasMorePages = false;
                });
            }
            catch (err) {
                throw err;
                };
        return [items, hasMorePages, lastEvaluatedStatus];
            }

    async putFeeds(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
        // trying to batchwrite zero items throws an error
        let length = followersAliases.length;
        let batchSize = 10;
        console.log(followersAliases.length + ' followers');
        for(let i = 0; i < length; i+=batchSize){
            await this.putFeedsInBatches(authorAlias, post, followersAliases.slice(i, i+batchSize), timestamp);
        }
        return true;
    }
    private async putFeedsInBatches(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
        // trying to batchwrite zero items throws an error
        if(followersAliases.length == 0) return true;
        // console.log(followersAliases + ' followersAliases');
        const params = {
                    RequestItems: {
                        [this.TABLE_NAME]: this.createPutFeedRequestBatch(post, authorAlias, followersAliases, timestamp)
                    }
                    }

        let resp = await ddbDocClient.send(new BatchWriteCommand(params))
        if(resp.UnprocessedItems != undefined){
            let ms = 1000;
            while(Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
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
        return true;
    }
    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    private createPutFeedRequestBatch(post: string, authorAlias: string, followerAliases: string[], timestamp: number){
        return followerAliases.map(follower => this.createPutFeedRequest(post, authorAlias, follower, timestamp));
    }
    private createPutFeedRequest(post: string, authorAlias: string, followeeAlias: string, timestamp: number){
        let item = {
            [this.PRIMARY_KEY]: followeeAlias,
            [this.SORT_KEY]: timestamp,
            [this.AUTHOR_ALIAS]: authorAlias,
            [this.POST]: post
        }
        let request = {
            PutRequest: {
                Item: item
            }
        }
        return request;
    }
}