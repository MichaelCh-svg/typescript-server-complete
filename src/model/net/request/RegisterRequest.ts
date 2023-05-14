export class RegisterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageUrl: string;

    public constructor(firstName: string, lastName: string, alias: string, password: string, imageUrl: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.imageUrl = imageUrl;
    }

}
