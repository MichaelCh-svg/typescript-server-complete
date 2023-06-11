import { getStatusService } from "../../../lambda/factory/factory";
import { FeedDao } from "./FeedDao";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";

export const handler = async function(event: any){
  let request = new PostFeedToSQSRequest([], 'alias2', 'post', 100);
  let feedDao = new FeedDao();
  //using foreach with await and async did not work and wouldn't post all the items
  for(let i = 0; i < event.Records.length; ++i){
    const { body } = event.Records[i];
      request = JSON.parse(body);
      // reqList.push(request);
        await feedDao.putFeeds(event.authorAlias, event.post, event.followerAliasList, event.timestamp);
      }
  return null;
}