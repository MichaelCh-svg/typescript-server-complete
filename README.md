# How to set up the project
To set up this project with aws, after cloning the project:

1. Compile a module with the entities and request/response objects for this project. This module will be used for both the client and the server. 
    - Go to <a href="https://github.com/MichaelCh-svg/tweeter-entities-chemps-svg">entities module</a> to setup and compile this module.
    - ctrl shift click to open the link in a new tab.
<br><br>
2. Link the module into this project. Run 'npm link --save [module folder path]'.

3. Navigate to the src/model/entities.ts file, and update the import to match the linked module.

1. Run 'npm i' to install the dependencies listed from package.json.
    - note: It is a good idea to run 'npm update' since out of date modules can contain security vulnerabilities. However, updated module versions sometimes break compatibility. It is recommended to get the code running first using the current dependency versions.

<br>
2. Create and upload the lambda layers with the node dependencies to each lambda in aws.

- Follow the instructions at <a href="https://github.com/MichaelCh-svg/tweeter-lambda-layer">tweeter lambda layer</a>.
<br>

2. Create a .env file using the .env.example template. Edit the .env file to have the correct variable values.
- To access the .env variables, there is a provided 'getEnvValue' function from the util/EnvString.ts file.
- Typescript does not recognize the .env file automatically.
- Alternatively, process.env can be used, but will require the following:
    - import and configure dotenv with the following two lines:<br>
    import * as dotenv from 'dotenv'<br>
    dotenv.config()
<br>

3. Run the edit.sh file to compile and upload the code. 
- In a git terminal, run './edit.sh'.
- If 7-zip is not installed, make sure to install 7-zip, then add it to the path environment variable in windows since it gets called in the script.
    - Sometimes, windows does not recognize a path environment variable if it has long file paths disabled. To enable longer file paths, follow the instructions at <a href ="https://www.thewindowsclub.com/how-to-enable-or-disable-win32-long-paths-in-windows-11-10">longer file paths</a>
<br>

4. For local testing, run a .ts file using 'ts-node [file].ts'.
    - Everything in the 'local' folder is deleted from the compiled files before being uploaded to the lambdas.
<br><br>
5. Furthermore, there is a script to enable and disable the sqs triggers in aws.
    - To save costs, we disable sqs lambda triggers when we don't use them.
