import { postStatus } from "../service/StatusService";
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";

export const handler = async function(event: any){
  let request = new PostStatusToSQSRequest('alias', 'post', 100);
    event.Records.forEach((record: { body: any; }) => {
        const { body } = record;
        request = JSON.parse(body);
      });

      return postStatus(request);
}