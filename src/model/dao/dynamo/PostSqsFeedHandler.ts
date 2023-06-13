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
      console.log('feed sqs request ' + JSON.stringify(request));
      await feedDao.putFeeds(request.authorAlias, request.post, request.followerAliasList, request.timestamp);
      }
  return null;
}