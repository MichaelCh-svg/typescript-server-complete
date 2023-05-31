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

  public static FromJson(json: string | null | undefined): AuthToken | null {
    if (!!json) {
      let jsonObject: { _token: string; _datetime: string } = JSON.parse(json);
      return new AuthToken(jsonObject._token, jsonObject._datetime);
    } else {
      return null;
    }
  }

  public ToJson(): string {
    return JSON.stringify(this);
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
