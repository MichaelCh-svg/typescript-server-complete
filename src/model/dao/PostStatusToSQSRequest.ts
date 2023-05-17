export class PostStatusToSQSRequest{

    alias: string;
    post: string;
    timestamp: number;

    constructor(alias: string, post: string, timestamp: number){
        this.alias = alias;
        this.post = post;
        this.timestamp = timestamp;
    }
}