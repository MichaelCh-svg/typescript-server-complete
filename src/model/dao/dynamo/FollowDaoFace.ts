import { User } from "../../domain/User";
import { IFollowDao } from "../IDaoFactory";
import { FollowDao } from "./FollowDao";
import { UserDao } from "./UserDao";


export class FollowDaoFace implements IFollowDao{
    private followDao = new FollowDao();
    private userDao = new UserDao();
    isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean> {
        return this.followDao.isFollowing(followerAlias, followeeAlias);
    }
    deleteFollow(alias: string, aliasToFollow: string): Promise<void> {
        return this.followDao.deleteFollow(alias, aliasToFollow);
    }
    putFollow(alias: string, aliasToFollow: string): Promise<void> {
        return this.followDao.putFollow(alias, aliasToFollow);
    }
    async getDAOFollowers(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[User[], boolean]> {
        let [followers, hasMorePages] = await this.followDao.getDAOFollowersAliases(followeeAlias, limit, lastFollowerAlias);
        console.log(followers.length + " followers\n" + JSON.stringify(followers));
        let users = await this.userDao.getUsersFromAliases(followers);
    
        //The users have to be in the same order that the followerAliaslist was in, otherwise the pagination for getFollowerAlias
        // list gets messed up, since the wrong exclusive start key is used, and so some items are returned in multiple pages.
        let sortedUsers = followers.map(f => {
            let user = users.find(u => u.alias == f);
            if(user === undefined) throw new Error("Get Followers: could not find user with alias " + f);
            else return user;
        });
        return [sortedUsers, hasMorePages];
    }
    async getDAOFollowees(followerAlias: string, limit: number, lastFolloweeAlias: string | null): Promise<[User[], boolean]> {
        let [followers, hasMorePages] = await this.followDao.getDAOFolloweesAliases(followerAlias, limit, lastFolloweeAlias);
        let users = await this.userDao.getUsersFromAliases(followers);
        //The users have to be in the same order that the followerAliaslist was in, otherwise the pagination for getFollowerAlias
        // list gets messed up, since the wrong exclusive start key is used, and so some items are returned in multiple pages.
        let sortedUsers = followers.map(f => {
            let user = users.find(u => u.alias == f);
            if(user === undefined) throw new Error("Get Followees: could not find user with alias " + f);
            else return user;
        });
        return [sortedUsers, hasMorePages];
    }
    
}