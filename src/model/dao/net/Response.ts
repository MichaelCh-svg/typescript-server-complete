import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";

export class Response{

    success: boolean;
    message: String | null;

    constructor(success: boolean, message: String | null = null){
        this.success = success;
        this.message = message;
    }
}
export class AuthenticateResponse extends Response{

    user: User;
    token: AuthToken;
    
    constructor(success: boolean, user: User, token: AuthToken, message: String | null = null){
        super(success, message);
        this.user = user;
        this.token = token;
    }
}
export class FollowCountResponse extends Response{

    count: number;
    
    constructor(success: boolean, count: number, message: String | null = null){
        super(success, message);
        this.count = count;
    }
}
export class UserResponse extends Response{

    user: User;
    
    constructor(success: boolean, user: User, message: String | null = null){
        super(success, message);
        this.user = user;
    }
}
export class IsFollowingResponse extends Response{

    follows: boolean
    
    constructor(success: boolean, follows: boolean, message: String | null = null){
        super(success, message);
        this.follows = follows;
    }
}
export class PagedResponse extends Response{

    hasMorePages: boolean;

    constructor(success: boolean, hasMorePages: boolean, message: String | null = null){
        super(success, message);
        this.hasMorePages = hasMorePages;
    }
}
export class FollowListResponse extends PagedResponse{

    followList: User[];

    constructor(success: boolean, hasMorePages: boolean, followList: User[], message: String | null = null){
        super(success, hasMorePages, message);
        this.followList = followList;
    }
}
export class StoryFeedResponse extends PagedResponse{

    statusList: Status[];

    constructor(success: boolean, hasMorePages: boolean, statusList: Status[], message: String | null = null){
        super(success, hasMorePages, message);
        this.statusList = statusList;
    }
}