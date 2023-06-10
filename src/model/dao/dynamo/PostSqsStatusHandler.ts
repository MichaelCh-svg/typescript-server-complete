
import { getStatusService } from "../../../lambda/factory/factory";
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";

export const handler = async function(event: any){
  let request = new PostStatusToSQSRequest('alias', 'post', 100);
    event.Records.forEach((record: { body: any; }) => {
        const { body } = record;
        request = JSON.parse(body);
      });
      let resp = await getStatusService().postStatus(request);
      return resp;
}