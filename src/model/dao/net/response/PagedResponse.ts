import { Response } from "./Response";

export class PagedResponse extends Response{
    hasMorePages: boolean;
    constructor(success: boolean, hasMorePages: boolean, message: String | null = null){
        super(success, message);
        this.hasMorePages = hasMorePages;
    }
}