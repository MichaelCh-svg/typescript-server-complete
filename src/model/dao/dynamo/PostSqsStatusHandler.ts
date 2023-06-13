
import { getStatusService } from "../../../lambda/factory/factory";
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";
import { postStatusFromSQSService } from "./SQSService";

export const handler = async function(event: any){
  let request = new PostStatusToSQSRequest('alias', 'post', 100);
  let resp;
  for(let i = 0; i < event.Records.length; ++i){
    const { body } = event.Records[i];
      request = JSON.parse(body);
      resp = await postStatusFromSQSService(request);
      }
  return resp;
}