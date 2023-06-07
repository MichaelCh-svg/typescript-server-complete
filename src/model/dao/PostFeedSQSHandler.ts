import { postStatusToFeed } from "../service/StatusService";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";

export const handler = async function(event: any){
  let request = new PostFeedToSQSRequest([], 'alias2', 'post', 100);
  //using foreach with await and async did not work and wouldn't post all the items
  for(let i = 0; i < event.Records.length; ++i){
    const { body } = event.Records[i];
      request = JSON.parse(body);
      // reqList.push(request);
      await postStatusToFeed(request);
  }
  return null;
}