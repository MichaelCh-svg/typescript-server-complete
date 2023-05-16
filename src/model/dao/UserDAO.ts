
import { BatchWriteCommand, ExecuteStatementCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";

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


