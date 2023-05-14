import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { putStory } from "../dao/StoryDAO";
import { getDAOFolloweesAliases } from "../dao/FollowDAO";

export function postStatus(event: PostStatusRequest){
    let timestamp = new Date().getTime();
    putStory(event.status.user.alias, timestamp, event.status.post);
    let hasMorePages = true;
    while(hasMorePages){
        let [followeeAliases, hasMorePages] = getDAOFolloweesAliases(event.status.user.alias, 10, "lastFolloweeAlias");
    }
    return new Response(true);
}