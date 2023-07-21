# How to set up the project
To set up this project with aws, after cloning the project:

1. Compile a module with the entities and request/response objects for this project. This module will be used for both the client and the server. Go to [entities module](https://github.com/MichaelCh-svg/tweeter-entities-chemps-svg) to setup and compile this module.
2. Install the module into this project. Run 'npm install [module folder path]'.
1. Run 'npm i' to install the dependencies listed from package.json.
    - note: It is a good idea to run 'npm update' since out of date modules can contain security vulnerabilities. However, updated module versions sometimes break compatibility. I would recommend checking that you can compile the code as is first.

    - if you later want to update the dependencies, remove the node_modules folder so that all files will be up to date (not just the ones that get overwritten).
2. Create and upload the lambda layers with the node dependencies to each lambda in aws.
    - Follow the instructions at [tweeter lambda layer](https://github.com/MichaelCh-svg/tweeter-lambda-layer)
2. Create a .env file using the .env.example template. Edit the .env file to match your variables.
    - Note that every time you use .env, you will have to import dotenv with the following two lines:<br>
        import * as dotenv from 'dotenv'<br>
        dotenv.config()
3. Run the edit.sh file to compile and upload the code. 
- In a git terminal, run './edit.sh'.
- If you don't have 7-zip installed, make sure to install 7-zip, then add it to the path environment variable in windows since it gets called in the script.
4. For local testing, run a .ts file using 'ts-node [file].ts'.
    - Everything in the 'local' folder is deleted from the compiled files before being uploaded to the lambdas.
5. Furthermore, there is a script to enable and disable the sqs triggers in aws.
    - To save costs, we disable sqs lambda triggers when we don't use them.

## Additional instructions
3. If you changed the name of the module containing the entities, then change the export on the src/dao/entities.ts file. There is only one line of code in this file.
