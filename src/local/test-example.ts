/**
Create a test.ts file to run temporary tests without them showing up as non-committed changes.
The 'src/local/test.ts' file is listed in the .gitignore file.

Here is an example of a local test.
To run the test, type 'ts-node src/local/test' in the terminal.
Note that async and await are not supported in the file called by 'ts-node'.
However, you can still use .then statements to handle the response.
**/

import { getUserService } from "../lambda/factory/factory";
import { LoginRequest } from "../model/entities";

let userAlias = '@colonel';
let password = 'password';
let loginRequest = new LoginRequest(userAlias, password);
getUserService().loginFromService(loginRequest).then(resp => console.log(resp));