/**
Rename this file to 'test.ts'.
The 'src/local/test.ts' file is listed in the .gitingore file, letting you create temporary tests without github
tracking them.

Here is an example of a local test.
To run the test, type 'ts-node src/local/test' in the terminal.
Note that async and await are not supported in the file called by 'ts-node'.
However, you can still use .then statements to handle the response.
**/

import { getUserService } from "../lambda/factory/factory";
import { AuthenticateResponse, LoginRequest } from "../model/entities";

let userAlias = '@cat3';
let password = 'cat3';
let loginRequest = new LoginRequest(userAlias, password);
getUserService().loginFromService(loginRequest).then(resp  => {
    let authenticateResponse = resp as AuthenticateResponse;
    console.log(authenticateResponse)}
    );