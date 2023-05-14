import { FakeData } from "../../util/FakeData";
import { User } from "../domain/User";

export function getDAOFollowees(followerAlias: String | null, limit: number, lastFolloweeAlias: String | null) : [User[], boolean] {
    
    let fakeData = FakeData.instance;
    let allFollowees = fakeData.fakeUsers;

    let followeesIndex = lastFolloweeAlias == null ? 0 : allFollowees.findIndex(user => user.alias == lastFolloweeAlias);
    if(followeesIndex == -1) throw Error("Follower alias " + followerAlias + " not found.");
    
    let length = allFollowees.length;
    let remainingFolloweesCount = length - followeesIndex;
    let returnFolloweesCount = remainingFolloweesCount > 10 ? 10 : remainingFolloweesCount;

    let responseFollowees = allFollowees.splice(followeesIndex, followeesIndex + returnFolloweesCount);
    let hasMorePages = remainingFolloweesCount > limit;
    return [responseFollowees, hasMorePages];
}