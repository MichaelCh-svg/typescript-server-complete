import { FollowerFollowingCountRequest } from "../model/net/request/FollowerFollowingCountRequest";
import { StoryRequest } from "../model/net/request/StoryRequest";
import { getFollowersCount } from "../model/service/FollowService";
import { getStory } from "../model/service/StatusService";

export const handler = async(event: FollowerFollowingCountRequest) => {
    // TODO implement
    return getFollowersCount(event);
};