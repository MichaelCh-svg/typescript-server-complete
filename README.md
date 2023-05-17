To set up this project with aws, after cloning the project:

1. Run npm i from within the project.
2. Create a .env file using the .env.example template. Edit the .env file to match your variables.
2. Edit the tsc-lambda.sh file.
    - Make sure that the lambda function names match those of yours.
3. Run the tsc-lambda.sh file. 
- In a git terminal, run './tsc-lambda.sh'.
- If you don't have 7-zip installed, make sure to install 7-zip, then add it to the path environment variable in windows since it gets called in the script.
4. Add a lambda layer to the lambdas for dependencies not included in the compiled files.
        - These dependences may include moment, uuid, aws-sdk, crypto, dotenv,...
    - Create a lambda layer in aws.
        - Navigate to lambda, then select layers on the left side.
        - Set the compatible runtime to the same as your lambda (should be Node.js 18.x).
        - Upload the typescript-env.zip file to the lambda layer.
    - Go to the lambda and add the layer as a custom layer.
    - If the zip file doesn't work properly, or you need to create your own dependencies for the lambda layer, follow the instructions at [lambda layers](lambdaLayers.md)


For local testing, run a .ts file using ts-node '[file].ts'.
Everything in the 'local' folder is excluded from the typescript build compile. The exclude parameters are set in the tsconfig.json file.
The test.ts file is also excluded from github. These are set in the .gitignore file.
