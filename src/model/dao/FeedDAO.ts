import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Status } from "../domain/Status";
import { ddbDocClient } from "./ClientDynamo";

const TABLE_NAME = 'feed';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'timestamp';
const FOLLOWER_ALIAS = 'followeeAlias';
const POST = 'post';

export function putFeeds(followeeAlias: string, post: String, followersAliases: string[], timestamp: number){
//     const allMovies = JSON.parse(fs.readFileSync("moviedata.json", "utf8"));
//   // Split the table into segments of 25.
//   const dataSegments = R.splitEvery(25, allMovies);
//   const TABLE_NAME = "TABLE_NAME"
//   try {
//     // Loop batch write operation 10 times to upload 250 items.
//     for (let i = 0; i < 10; i++) {
//       const segment = dataSegments[i];
//       for (let j = 0; j < 25; j++) {
//         const params = {
//           RequestItems: {
//             [TABLE_NAME]: [
//               {
//                 // Destination Amazon DynamoDB table name.
//                 PutRequest: {
//                   Item: {
//                     year: segment[j].year,
//                     title: segment[j].title,
//                     info: segment[j].info,
//                   },
//                 },
//               },
//             ],
//           },
//         };
//         ddbDocClient.send(new BatchWriteCommand(params));
//       }
//       console.log("Success, table updated.");
//     }
//   } catch (error) {
//     console.log("Error", error);
//   }
}
function createPutFeedRequestBatch(post: string, followeeAlias: string, followerAliases: string[], timestamp: number){
    return followerAliases.map(follower => createPutFeedRequest(post, follower, followeeAlias, timestamp));
}
function createPutFeedRequest(post: string, followerAlias: string, followeeAlias: string, timestamp: number){
    let item = {
        [PRIMARY_KEY]: followerAlias,
        [SORT_KEY]: timestamp,
        [FOLLOWER_ALIAS]: followeeAlias,
        [POST]: post
    }
    let request = {
        PutRequest: {
            Item: item
        }
    }
    return request;
}