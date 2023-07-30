import { OtherUserRequest } from "../model/entities";
import { getUserService } from "./factory/factory";


export const handler = async(event: OtherUserRequest) => {
    // TODO implement
    console.log('get user lambda request:\n' + JSON.stringify(event));
    let deseralizedRequest = OtherUserRequest.fromJson(event);
    console.log('get user lambda deserialized request:\n' + JSON.stringify(deseralizedRequest));
    return getUserService().getUserFromService(deseralizedRequest);
};