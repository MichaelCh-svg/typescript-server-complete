import { v4 as uuid } from "uuid";
import moment from "moment";

export class AuthToken {
  private _token: string;
  private _datetime: string | null;

  public static Generate(): AuthToken {
    let token: string = uuid().toString();
    let date: string = moment(Date.now()).format("DD-MMM-YYYY HH:mm:ss");
    return new AuthToken(token, date);
  }

  public constructor(token: string, dateTime: string | null) {
    this._token = token;
    this._datetime = dateTime;
  }

  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  public get datetime(): string | null {
    return this._datetime;
  }

  public set datetime(value: string | null) {
    this._datetime = value;
  }
}
