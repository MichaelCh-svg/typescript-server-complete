
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
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
            PRIMARY_KEY:  username,
        },
    };
    return await ddbDocClient.send(new GetCommand(params)).then(data => {
        if(data.Item == undefined) throw Error("There is no user with username " + username)
        else return data.Item});
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
      console.log("Error", err);
    }
  };


