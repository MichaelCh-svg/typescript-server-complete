import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { putStory } from "../dao/StoryDAO";
import { getDAOFolloweesAliases } from "../dao/FollowDAO";

export async function postStatus(event: PostStatusRequest){
    let timestamp = new Date().getTime();
    await putStory(event.alias, timestamp, event.post);
    // let hasMorePages = true;
    // while(hasMorePages){
    //     let [followeeAliases, hasMorePages] = getDAOFolloweesAliases(event.status.user.alias, 10, "lastFolloweeAlias");
    // }
    return new Response(true, event.alias + " posted " + event.post + " at " + timestamp);
}