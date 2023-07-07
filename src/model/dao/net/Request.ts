import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";

export class LoginRequest{

    username: string;
    password: string;

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }
}
export class RegisterRequest {

    username: string;
    firstName: string;
    lastName: string;
    password: string;
    imageUrl: string;

    public constructor(username: string, firstName: string, lastName: string, password: string, imageUrl: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.imageUrl = imageUrl;
    }

}
export class AuthorizedRequest{

    user: User
    token: AuthToken

    constructor(user: User, token: AuthToken){
        this.user = user;
        this.token = token;
    }

    static fromJson (request: AuthorizedRequest){
        let user = User.FromJson(JSON.stringify(request.user));
        let token = AuthToken.FromJson(JSON.stringify(request.token));
        if(user == null) throw new Error('Authorized Request, could not deserialize user with json:\n' + JSON.stringify(request.user));
        else if(token == null) throw new Error('Authorized Request, could not deserialize token with json:\n' + JSON.stringify(request.token));
        else{
            let deseralizedRequest = new AuthorizedRequest(user, token);
            return deseralizedRequest;
        }
    }
}
export class GetUserRequest extends AuthorizedRequest{

    usernameToGet: string;

    constructor(user: User, token: AuthToken, usernameToGet: string){
        super(user, token);
        this.usernameToGet = usernameToGet;
    }

    static fromJson (request: GetUserRequest){
        let authorizedRequest: AuthorizedRequest;
        try{
            authorizedRequest = AuthorizedRequest.fromJson(request);
        } 
        catch(err){
            throw new Error('GetUserRequest error: ' + err);
        }

        let deseralizedRequest = new GetUserRequest(authorizedRequest.user, authorizedRequest.token, request.usernameToGet);
        return deseralizedRequest;
    }
}

export class OtherUserRequest extends AuthorizedRequest{

    otherUser: User;

    constructor(user: User, token: AuthToken, otherUser: User){
        super(user, token);
        this.otherUser = otherUser
    }

    static fromJson (request: OtherUserRequest){
        let authorizedRequest: AuthorizedRequest;
        try{
            authorizedRequest = AuthorizedRequest.fromJson(request);
        } 
        catch(err){
            throw new Error('OtherUserRequest error: ' + err);
        }
        let otherUser = User.FromJson(JSON.stringify(request.otherUser));
        if(otherUser == null) throw new Error('OtherUserRequest, could not deserialize otherUser with json:\n' + JSON.stringify(request.otherUser));
        else{
            let deseralizedRequest = new OtherUserRequest(authorizedRequest.user, authorizedRequest.token, otherUser);
            return deseralizedRequest;
        }
    }
}

export class PostStatusRequest extends AuthorizedRequest {

    post: string;

    constructor(user: User, token: AuthToken, post: string){
        super(user, token);
        this.post = post;
    }

    static fromJson (request: PostStatusRequest){
        let authorizedRequest: AuthorizedRequest;
        try{
            authorizedRequest = AuthorizedRequest.fromJson(request);
        } 
        catch(err){
            throw new Error('PostStatusRequest error: ' + err);
        }

        let deseralizedRequest = new PostStatusRequest(authorizedRequest.user, authorizedRequest.token, request.post);
        return deseralizedRequest;
    }
}

export class FollowListRequest extends AuthorizedRequest{

    limit: number;
    lastFollowUser: User | null;

    constructor(user: User, token: AuthToken, limit: number, lastFollowUser: User | null){
        super(user, token);
        this.limit = limit;
        this.lastFollowUser = lastFollowUser;
    }

    static fromJson (request: FollowListRequest){
        let authorizedRequest: AuthorizedRequest;
        try{
            authorizedRequest = AuthorizedRequest.fromJson(request);
        } 
        catch(err){
            throw new Error('FollowListRequest error: ' + err);
        }
        let lastFollowUser: User | null = null;
        if(request.lastFollowUser != null){
            lastFollowUser = User.FromJson(JSON.stringify(request.lastFollowUser));
            if(lastFollowUser == null) throw new Error('FollowListRequest, could not deserialize lastFollowUser with json:\n' + JSON.stringify(request.lastFollowUser));
        }

        let deseralizedRequest = new FollowListRequest(authorizedRequest.user, authorizedRequest.token, request.limit, lastFollowUser);
        return deseralizedRequest;
    }
}
export class StoryFeedRequest extends AuthorizedRequest{

    limit: number;
    lastStatus: Status | null;

    constructor(user: User, token: AuthToken, limit: number, lastStatus: Status | null){
        super(user, token);
        this.lastStatus = lastStatus
        this.limit = limit;
    }
    static fromJson (request: StoryFeedRequest){
        let authorizedRequest: AuthorizedRequest;
        try{
            authorizedRequest = AuthorizedRequest.fromJson(request);
        } 
        catch(err){
            throw new Error('StatusListRequest error: ' + err);
        }
        let deserializedLastStatus = Status.FromJson(JSON.stringify(request.lastStatus));
        if(request.lastStatus != null) {
            console.log('deserialized last status ' + JSON.stringify(deserializedLastStatus));
        }
        let deseralizedRequest = new StoryFeedRequest(authorizedRequest.user, authorizedRequest.token, request.limit, deserializedLastStatus);
        return deseralizedRequest;
    }
}