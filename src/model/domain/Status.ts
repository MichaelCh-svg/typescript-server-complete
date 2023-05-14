import { User } from "./User";
import moment from "moment";

export class Status {
    private _post: string;
    private _user: User;
    private _timestamp: number;
    private _urls: string[];
    private _mentions: string[];
    
    public constructor(post: string, user: User, timestamp: number, urls: string[], mentions: string[]) {
        this._post = post;
        this._user = user;
        this._timestamp = timestamp;
        this._urls = urls;
        this._mentions = mentions;
    }

    public get post(): string {
        return this._post;
    }

    public set post(value: string) {
        this._post = value;
    }
 
    public get user(): User {
        return this._user;
    }
 
    public set user(value: User) {
        this._user = value;
    }

    public get timestamp(): number {
        return this._timestamp;
    }
 
    public get formattedDate(): string {
        let date: Date = new Date(this.timestamp);
        return (moment(date)).format('DD-MMM-YYYY HH:mm:ss');
    }

    public set timestamp(value: number) {
        this._timestamp = value;
    }

    public get urls(): string[] {
        return this._urls;
    }

    public set urls(value: string[]) {
        this._urls = value;
    }

    public get mentions(): string[] {
        return this._mentions;
    }
 
    public set mentions(value: string[]) {
        this._mentions = value;
    }
}
