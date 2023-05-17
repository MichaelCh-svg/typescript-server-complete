import { postStatusToFeed } from "../service/StatusService";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";

export const handler = async function(event: any){
  let request = new PostFeedToSQSRequest([], 'alias2', 'post', 100);
    event.Records.forEach((record: { body: any; }) => {
        const { body } = record;
        request = JSON.parse(body);
      });

      return postStatusToFeed(request);;
}