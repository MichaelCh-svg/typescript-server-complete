import { FakeData } from "../../../util/FakeData";
import { User } from "../../entities";
import { IFollowDao } from "../IDaoFactory";

export class FollowDaoFake implements IFollowDao {
    
    private fakeData = FakeData.instance;

    async isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean> {
        return Math.floor(Math.random() * 2) == 1;
    }
    async deleteFollow(alias: string, aliasToFollow: string): Promise<void> {
        return;
    }
    async putFollow(alias: string, aliasToFollow: string): Promise<void> {
        return;
    }
    async getFollowers(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[User[], boolean]> {
        let allFollowees = this.fakeData.fakeUsers;

        let followeesIndex = lastFollowerAlias == null ? 0 : allFollowees.findIndex(user => user.alias === lastFollowerAlias);
        if(followeesIndex == -1) throw Error("Follower alias " + lastFollowerAlias + " not found in." + JSON.stringify(allFollowees));
        
        let length = allFollowees.length;
        let remainingFolloweesCount = length - followeesIndex;
        let returnFolloweesCount = remainingFolloweesCount > 10 ? 10 : remainingFolloweesCount;

        //make sure to use 'slice' and not 'splice' since splice changes the original array.
        let responseFollowees = allFollowees.slice(followeesIndex, followeesIndex + returnFolloweesCount);
        let hasMorePages = remainingFolloweesCount > limit;
        return [responseFollowees, hasMorePages];
    }
    async getFollowees(followerAlias: string, limit: number, lastFolloweeAlias: string | null): Promise<[User[], boolean]> {
        let allFollowees = this.fakeData.fakeUsers;

        let followeesIndex = lastFolloweeAlias == null ? 0 : allFollowees.findIndex(user => user.alias === lastFolloweeAlias);
        if(followeesIndex == -1) throw Error("Followee alias " + lastFolloweeAlias + " not found in ." + JSON.stringify(allFollowees));
        
        let length = allFollowees.length;
        let remainingFolloweesCount = length - followeesIndex;
        let returnFolloweesCount = remainingFolloweesCount > 10 ? 10 : remainingFolloweesCount;

        //make sure to use 'slice' and not 'splice' since splice changes the original array.
        let responseFollowees = allFollowees.slice(followeesIndex, followeesIndex + returnFolloweesCount);
        let hasMorePages = remainingFolloweesCount > limit;
        return [responseFollowees, hasMorePages];
    }
    
}