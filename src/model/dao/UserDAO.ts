
import { BatchGetCommand, BatchWriteCommand, ExecuteStatementCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ClientDynamo";
import { User } from "../domain/User";
import { AttributeValue, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = 'user';
const PRIMARY_KEY = 'alias';
const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const PASSWORD = 'password';
const IMAGE_URL = 'imageUrl';

export async function getUser (username: String) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            [PRIMARY_KEY]:  username,
        },
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
        return data.Item});
};

export async function putUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string) {
    // Set the parameters.
    const params = {
      TableName: TABLE_NAME,
      Item: {
        [PRIMARY_KEY]: alias, //e.g. title: "Rush"
        [FIRST_NAME]: firstName, // e.g. year: "2013"
        [LAST_NAME]: lastName,
        [PASSWORD]: password,
        [IMAGE_URL]: imageUrl
      },
    };
    try {
      await ddbDocClient.send(new PutCommand(params));
    } catch (err) {
      throw err;
    }
  };
  export function createGetUserRequest(alias: string){
    let item =  {
      "alias": {S: alias }
    }
    return item;
  }
  export async function getUsersFromAliases(aliases: string[]): Promise<User[]> {
    let keys = [];
    for(let i = 0; i < aliases.length; ++i){
      keys.push(createGetUserRequest(aliases[i]));
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

  export async function createUsers(firstName: string, lastName: string, aliasList: string[], password: string, imageUrl: string){
    const params = {
                  RequestItems: {
                    [TABLE_NAME]: createPutUserRequestBatch(firstName, lastName, aliasList, password, imageUrl)
                  }
                }

    await ddbDocClient.send(new BatchWriteCommand(params))
}
function createPutUserRequestBatch(firstName: string, lastName: string, aliasList: string[], password: string, imageUrl: string){
    return aliasList.map(alias => createPutUserRequest(firstName, lastName, alias, password, imageUrl));
}
function createPutUserRequest(firstName: string, lastName: string, alias: string, password: string, imageUrl: string){
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

// export const deleteOldUsers = async (username: string) => {
//   const params = {
//     Statement: "DELETE FROM " + TABLE_NAME + " where " + PRIMARY_KEY +"=?",
//     Parameters: [{ S: username }],
//   };
//   console.log(params);
//   try {
//     await ddbDocClient.send(new ExecuteStatementCommand(params));
//     console.log("Success. Item deleted.");
//     return "Run successfully"; // For unit tests.
//   } catch (err) {
//     console.error(err);
//   }
// };


