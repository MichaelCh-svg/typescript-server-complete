export class PostFeedToSQSRequest{

    followerAliasList: string[];
    authorAlias: string;
    post: string;
    timestamp: number;

    constructor(followerAliasList: string[], authorAlias: string, post: string, timestamp: number){
        this.followerAliasList = followerAliasList;
        this.authorAlias = authorAlias;
        this.post = post;
        this.timestamp = timestamp;
    }
}