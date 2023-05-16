import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";

const TABLE_NAME = 'feed';
const PRIMARY_KEY = 'followerAlias';
const SORT_KEY = 'timestamp';
const AUTHOR_ALIAS = 'authorAlias';
const POST = 'post';

export async function putFeeds(authorAlias: string, post: string, followersAliases: string[], timestamp: number){
    const params = {
                  RequestItems: {
                    [TABLE_NAME]: createPutFeedRequestBatch(post, authorAlias, followersAliases, timestamp)
                  }
                }
    console.log(params);
    await ddbDocClient.send(new BatchWriteCommand(params))
}
function createPutFeedRequestBatch(post: string, authorAlias: string, followerAliases: string[], timestamp: number){
    return followerAliases.map(follower => createPutFeedRequest(post, authorAlias, follower, timestamp));
}
function createPutFeedRequest(post: string, authorAlias: string, followeeAlias: string, timestamp: number){
    let item = {
        [PRIMARY_KEY]: followeeAlias,
        [SORT_KEY]: timestamp,
        [AUTHOR_ALIAS]: authorAlias,
        [POST]: post
    }
    let request = {
        PutRequest: {
            Item: item
        }
    }
    return request;
}

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