export class LoginRequest{

    _alias: String | null;
    password: String | null;

    constructor(_alias: String | null, password: String | null){
        this._alias = _alias;
        this.password = password;
    }
}