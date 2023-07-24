# How to set up the project
To set up this project with aws, after cloning the project:

1. Compile a module with the entities and request/response objects for this project. This module will be used for both the client and the server. 
    - Go to <a href="https://github.com/MichaelCh-svg/tweeter-entities-chemps-svg">entities module</a> to setup and compile this module.
    - ctrl shift click to open the link in a new tab.
<br><br>
2. Install the module into this project. Run 'npm install [module folder path]'.

1. Run 'npm i' to install the dependencies listed from package.json.
    - note: It is a good idea to run 'npm update' since out of date modules can contain security vulnerabilities. However, updated module versions sometimes break compatibility. I would recommend checking that you can compile the code as is first.

    - if you later want to update the dependencies, remove the node_modules folder so that all files will be up to date (not just the ones that get overwritten).
<br><br>
2. Create and upload the lambda layers with the node dependencies to each lambda in aws.
    - Follow the instructions at <a href="https://github.com/MichaelCh-svg/tweeter-lambda-layer">tweeter lambda layer</a>.
<br><br>
2. Create a .env file using the .env.example template. Edit the .env file to match your variables.
    - Note that when you want to access the .env variables, you should use the provided 'getEnvValue' function from the util/EnvString.ts file.
    - Typescript does not recognize the .env file automatically.
    - Alternatively, you can use process.env, but will have to do the following:
        - import and configure dotenv with the following two lines:<br>
        import * as dotenv from 'dotenv'<br>
        dotenv.config()
<br><br>
3. Run the edit.sh file to compile and upload the code. 
    - In a git terminal, run './edit.sh'.
    - If you don't have 7-zip installed, make sure to install 7-zip, then add it to the path environment variable in windows since it gets called in the script.
<br><br>
4. For local testing, run a .ts file using 'ts-node [file].ts'.
    - Everything in the 'local' folder is deleted from the compiled files before being uploaded to the lambdas.
<br><br>
5. Furthermore, there is a script to enable and disable the sqs triggers in aws.
    - To save costs, we disable sqs lambda triggers when we don't use them.

## Additional instructions
3. If you changed the name of the module containing the entities, then change the export on the src/dao/entities.ts file. There is only one line of code in this file.
