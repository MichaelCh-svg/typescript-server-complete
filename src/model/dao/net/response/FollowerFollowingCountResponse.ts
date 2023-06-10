
import { Response } from "./Response"
export class FollowerFollowingCountResponse extends Response{

    count: number;
    
    constructor(success: boolean, count: number, message: String | null = null){
        super(success, message);
        this.count = count;
    }
}