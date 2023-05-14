export class LoginRequest{

    username: String | null;
    password: String | null;

    constructor(username: String | null, password: String | null){
        this.username = username;
        this.password = password;
    }
}