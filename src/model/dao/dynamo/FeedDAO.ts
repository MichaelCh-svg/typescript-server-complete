import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { getEnvValue } from "../../../util/EnvString";
import { Status, User } from "../../entities";


export class FeedDao {
    private TABLE_NAME = getEnvValue('FEED_TABLE_NAME');
    private PRIMARY_KEY = getEnvValue('FEED_PRIMARY_KEY');
    private SORT_KEY = getEnvValue('FEED_SORT_KEY');
    private AUTHOR_ALIAS = getEnvValue('FEED_AUTHOR_ALIAS');
    private POST = getEnvValue('FEED_POST');


    async getFeedStatusListWithoutUsers(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean]> {
        let params;
        if(lastStatus != undefined){
            params =  {
                KeyConditionExpression: this.PRIMARY_KEY + " = :s",
                // FilterExpression: "contains (Subtitle, :topic)",
                ExpressionAttributeValues: {
                ":s": alias
                },
                TableName: this.TABLE_NAME,
                Limit: limit,
                // The format for the exclusive start key is different for the feed than it is for
                // the Follow, and I'm not sure why. There are hardly any online examples of how to
                // do an exclusive start key in node. However, someone commented that
                // the exclusive start key follows the same format as the last evaluated Key so 
                // if you do a query without a start key and print out the last evaluated Key 
                // you can get the format
                ExclusiveStartKey: {
                    [this.PRIMARY_KEY]: alias,
                    [this.SORT_KEY]: lastStatus.timestamp,
                    // [this.AUTHOR_ALIAS]: { S: lastStatus.user.alias },
                    // [this.POST]: { S: lastStatus.post }
                },
                ScanIndexForward: false
        
            };
        }
        else{
            params =  {
            KeyConditionExpression: this.PRIMARY_KEY + " = :s",
            ExpressionAttributeValues: {
                ":s": alias
            },
            TableName: this.TABLE_NAME,
            Limit: limit,
            ScanIndexForward: false 
            };
            
        }
        console.log(JSON.stringify(params));
        let items : Status[] = [];
        let hasMorePages = true;
        let data;
            try {
                
                data = await ddbClient.send(new QueryCommand(params)).then(data => {
                    console.log('then statement');
                    if(data.Items != undefined && data.Items.length > 0){
                        data.Items.forEach(s => {
                        items.push(new Status(s[this.POST], new User('undefined', 'undefined', s[this.AUTHOR_ALIAS], 'undefined'), s[this.SORT_KEY]))});
                    }
                    if(items.length == 0) hasMorePages = false;
                    if(data.LastEvaluatedKey == undefined){
                        hasMorePages = false;
                    }
                    else console.log(data.LastEvaluatedKey);
                });
            }
            catch (err) {
                throw err;
                };
        return [items, hasMorePages];
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
                console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
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
