export class Response{
    success: boolean;
    message: String | null;
    constructor(success: boolean, message: String | null = null){
        this.success = success;
        this.message = message;
    }
}