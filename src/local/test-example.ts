/**
This file is listed in the .gitignore file. You can edit it without it showing up as a non-committed change.

Here is an example of a local test.
To run the test, type 'ts-node src/local/test' in the terminal.
Note that async and await are not supported in the file called by 'ts-node'.
However, you can still use .then statements to handle the response.
**/

import { LoginRequest } from "tweeter-entities-chemps-svg";
import { getUserService } from "../lambda/factory/factory";

let userAlias = '@colonel';
let password = 'password';
let loginRequest = new LoginRequest(userAlias, password);
getUserService().loginFromService(loginRequest).then(resp => console.log(resp));