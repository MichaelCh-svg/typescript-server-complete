export class User {
    private _firstName: string;
    private _lastName: string;
    private _alias: string;
    private _imageUrl: string;

    public constructor(firstName: string, lastName: string, alias: string, imageUrl: string) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._alias = alias;
        this._imageUrl = imageUrl;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(value: string) {
        this._lastName = value;
    }

    public get name() {
        return `${this.firstName} ${this.lastName}`;
    }

    public get alias(): string {
        return this._alias;
    }

    public set alias(value: string) {
        this._alias = value;
    }

    public get imageUrl(): string {
        return this._imageUrl;
    }

    public set imageUrl(value: string) {
        this._imageUrl = value;
    }
    toJsonString(): string {
        let json = JSON.stringify(this);
        Object.keys(this).filter(key => key[0] === "_").forEach(key => {
            json = json.replace(key, key.substring(1));
        });

        return json;
    }
    static fromJSON(json: any) {
        $.extend(this, json);
      }
    fromJSON(json: any) {
        $.extend(this, json);
    }
}
