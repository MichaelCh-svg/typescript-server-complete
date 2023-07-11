
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";
import { User } from "../../domain/User";
import { BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import { getEnvValue } from "../../../util/EnvString";


const TABLE_NAME = getEnvValue('USER_TABLE_NAME');
const PRIMARY_KEY = getEnvValue('USER_PRIMARY_KEY');
const FIRST_NAME = getEnvValue('USER_FIRST_NAME');
const LAST_NAME = getEnvValue('USER_LAST_NAME');
const PASSWORD = getEnvValue('USER_PASSWORD');
const IMAGE_URL = getEnvValue('USER_IMAGE_URL');
const FOLLOWING_COUNT = getEnvValue('USER_FOLLOWING_COUNT');
const FOLLOWERS_COUNT = getEnvValue('USER_FOLLOWERS_COUNT');

export class UserDao {

  async decrementFollowersCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":dec": 1 },
      UpdateExpression: "SET " + FOLLOWERS_COUNT + " = " + FOLLOWERS_COUNT + ' - :dec'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return;});
  }
  async decrementFollowingCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":dec": 1 },
      UpdateExpression: "SET " + FOLLOWING_COUNT + " = " + FOLLOWING_COUNT + ' - :dec'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return;});
  }
  async incrementFollowersCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": 1 },
      UpdateExpression: "SET " + FOLLOWERS_COUNT + " = " + FOLLOWERS_COUNT + ' + :inc'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return;});
  }
  async incrementFollowingCount(alias: string){
    const params = {
      TableName: TABLE_NAME,
      Key: { [PRIMARY_KEY]: alias},
      ExpressionAttributeValues: { ":inc": 1 },
      UpdateExpression: "SET " + FOLLOWING_COUNT + " = " + FOLLOWING_COUNT + ' + :inc'
    };
    return await ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return;});
  }
  async login (username: string, hashedPassword: String) : Promise<User>{
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
      let userData = data.Item;
      if(userData === undefined || userData[PASSWORD] != hashedPassword) throw new Error('could not login for ' + username + ', wrong username or password');
      // if(userData === undefined) throw new Error('could not login for ' + username + ', wrong username or password');
      else return new User(userData[FIRST_NAME], userData[LAST_NAME], userData[PRIMARY_KEY], userData[IMAGE_URL]);
  })}
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
        return new User(userData[FIRST_NAME], userData[LAST_NAME], userData[PRIMARY_KEY], userData[IMAGE_URL]);
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
                      
                      data.Responses[TABLE_NAME].forEach(s => {
                        let alias = s[PRIMARY_KEY].S;
                        let firstname = s[FIRST_NAME].S;
                        let lastname = s[LAST_NAME].S;
                        let imageUrl = s[IMAGE_URL].S;

                        alias = alias  === undefined ? 'undefined' : alias;
                        firstname = firstname === undefined ? 'undefined' : firstname;
                        lastname = lastname === undefined ? 'undefined' : lastname;
                        imageUrl = imageUrl === undefined ? 'undefined' : imageUrl;

                        items.push(new User(firstname, lastname, alias, imageUrl))});
                  }
              });
          }
          catch (err) {
              throw err;
              };
        return items;       
  }

}




