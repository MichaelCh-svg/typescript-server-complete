export class LoginRequest{

    _alias: string | null;
    password: string | null;

    constructor(_alias: string | null, password: string | null){
        this._alias = _alias;
        this.password = password;
    }
}