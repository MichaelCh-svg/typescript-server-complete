import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";
const TABLE_NAME = 'story';
const PRIMARY_KEY = 'alias';
const SORT_KEY = 'timestamp';
const POST = 'post';

export async function putStory(alias: string, timestamp: number, post: string) {
    // Set the parameters.
    const params = {
      TableName: TABLE_NAME,
      Item: {
        [PRIMARY_KEY]: alias, //e.g. title: "Rush"
        [SORT_KEY]: timestamp, // e.g. year: "2013"
        [POST]: post,
      },
    };
    try {
      await ddbDocClient.send(new PutCommand(params)).then(j => j);
    } catch (err) {
      throw err;
    }
  };