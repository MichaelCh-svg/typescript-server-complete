
import { BatchWriteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";
import { User } from "../../domain/User";
import { BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import { IUserDao } from "../IDaoFactory";

const TABLE_NAME = 'user';
const PRIMARY_KEY = 'alias';
const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const PASSWORD = 'password';
const IMAGE_URL = 'imageUrl';
const FOLLOWING_COUNT = 'followingCount';
const FOLLOWERS_COUNT = 'followersCount';
export class UserDAO implements IUserDao{
  async decrementFollowersCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":dec": 1 },
      UpdateExpression: "SET " + FOLLOWERS_COUNT + " = " + FOLLOWERS_COUNT + ' - :dec'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
  async decrementFollowingCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":dec": 1 },
      UpdateExpression: "SET " + FOLLOWING_COUNT + " = " + FOLLOWING_COUNT + ' - :dec'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
  async incrementFollowersCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": 1 },
      UpdateExpression: "SET " + FOLLOWERS_COUNT + " = " + FOLLOWERS_COUNT + ' + :inc'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
  async incrementFollowingCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": 1 },
      UpdateExpression: "SET " + FOLLOWING_COUNT + " = " + FOLLOWING_COUNT + ' + :inc'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
  
  async getUser (username: string) : Promise<User>{
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
      let userData = data.Item;
      if(userData != undefined){
        return new User(userData.firstName, userData.lastName, userData.alias, userData.imageUrl);
      }
      else throw new Error('user not found for user with alias ' + username);
  })}
  async isUser (username: string) : Promise<boolean>{
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
        ProjectionExpression: PRIMARY_KEY
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
      let userData = data.Item;
      return userData !== undefined;
  })}
  async getUserFollowersCount (username: string) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
        ProjectionExpression: FOLLOWERS_COUNT
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
      if(data.Item === undefined) throw new Error('data.Item is undefined');
      else return data.Item[FOLLOWERS_COUNT]});
  };
  async getUserFollowingCount (username: string) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
        ProjectionExpression: FOLLOWING_COUNT
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
      if(data.Item === undefined) throw new Error('data.Item is undefined');
      else return data.Item[FOLLOWING_COUNT]});
  };
  
  async putUser(user: User, password: string) {
      // Set the parameters.
      const params = {
        TableName: TABLE_NAME,
        Item: {
          [PRIMARY_KEY]: user.alias, //e.g. title: "Rush"
          [FIRST_NAME]: user.firstName, // e.g. year: "2013"
          [LAST_NAME]: user.lastName,
          [PASSWORD]: password,
          [IMAGE_URL]: user.imageUrl,
          [FOLLOWERS_COUNT]: 0,
          [FOLLOWING_COUNT]: 0
        },
      };
      try {
        let resp = await ddbDocClient.send(new PutCommand(params));
        return resp.$metadata.httpStatusCode == 200
      } catch (err) {
        throw err;
      }
    };
    createGetUserRequest(alias: string){
      let item =  {
        "alias": {S: alias }
      }
      return item;
    }
    async getUsersFromAliases(aliases: string[]): Promise<User[]> {
      if(aliases.length == 0) return [];
      let keys = [];
      for(let i = 0; i < aliases.length; ++i){
        keys.push(this.createGetUserRequest(aliases[i]));
      }
      let command = new BatchGetItemCommand({
        // Each key in this object is the name of a table. This example refers
        // to a Books table.
        RequestItems: {
          [TABLE_NAME]: {
            // Each entry in Keys is an object that specifies a primary key.
            Keys: keys
          }
        }});
      
        let items : User[] = [];
        let data;
          try {
              data = await ddbDocClient.send(command).then(data => {
                 
                  if(data.Responses != undefined){
                      // unfortunately, I can't use s.PRIMARY_KEY.S, because I can't use variables here.
                      // Instead we have to hardcode the value.
                      data.Responses[TABLE_NAME].forEach(s => {
                        items.push(new User(s.firstName.S === undefined ? 'undefined': s[FIRST_NAME].S, s[LAST_NAME].S === undefined ? 'undefined': s.lastName.S,
                        s.alias.S === undefined ? 'undefined': s.alias.S, s.imageUrl.S === undefined ? 'undefined': s.imageUrl.S))});
                  }
              });
          }
          catch (err) {
              throw err;
              };
        return items;       
  }
  
  
    //following functions not used by the application, but for setting up the data
  
    async createUsers(firstName: string, lastName: string, aliasList: string[], password: string, imageUrl: string){
      const params = {
                    RequestItems: {
                      [TABLE_NAME]: this.createPutUserRequestBatch(firstName, lastName, aliasList, password, imageUrl)
                    }
                  }
  
      await ddbDocClient.send(new BatchWriteCommand(params))
  }
  createPutUserRequestBatch(firstName: string, lastName: string, aliasList: string[], password: string, imageUrl: string){
      return aliasList.map(alias => this.createPutUserRequest(firstName, lastName, alias, password, imageUrl));
  }
  createPutUserRequest(firstName: string, lastName: string, alias: string, password: string, imageUrl: string){
      let item = {
          [PRIMARY_KEY]: alias,
          [FIRST_NAME]: firstName,
          [LAST_NAME]: lastName,
          [PASSWORD]: password,
          [IMAGE_URL]: imageUrl
      }
      let request = {
          PutRequest: {
              Item: item
          }
      }
      return request;
  }
}




