import { postStatusToFeed } from "../service/StatusService";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";

export const handler = async function(event: any){
  let request = new PostFeedToSQSRequest([], 'alias2', 'post', 100);
  let reqList: PostFeedToSQSRequest[] = new Array();
  let resp = null;
  event.Records.forEach((record: { body: any; }) => {
      const { body } = record;
      request = JSON.parse(body);
      reqList.push(request);
    });
  console.log('num messages ' + reqList.length)
  let aliasList: string[] = new Array();
  reqList.forEach(element => {
    element.followerAliasList.forEach(el => aliasList.push(el));
    // resp = await postStatusToFeed(element);
  });
  request.followerAliasList = aliasList;
  await postStatusToFeed(request);
  return resp;
}