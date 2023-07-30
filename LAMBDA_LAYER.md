# Tweeter Lambda Layer
Since the node_modules aren't included in transpilation, these have to be uploaded to the lambdas separately through a lambda layer.

Follow these steps to setup the lambda layer.

1. If the tweeter entities module has not yet been compiled and imported to this project, follow the instructions at the following link: https://github.com/MichaelCh-svg/tweeter-entities-chemps-svg
    - These entities are compiled as a module so that they can be reused for the client and the server..
2. Link the previously compiled module into this project. Run 'npm link --save [project folder path]'.
3. Run 'npm i' to install the dependencies listed from package.json.
    - note: It is a good idea to run 'npm update' since out of date modules can contain security vulnerabilities. However, updated module versions sometimes break compatibility. It is recommended to get the code running first using the current dependency versions.
4. The lambda layer has to follow a specific file structure for the lamba to recognize it:
    1. Create a folder called nodejs.
        - note: nodejs is already listed in the .gitignore file.
    2. Copy the node_modules folder into the nodejs folder using the following command: cp -rL [source] [destination]
        - Copying from file explorer does not copy the contents of the symbolic link. 
    3. Zip the nodejs folder.
        - Make sure to zip the nodejs folder itself, and not just the folder's contents.
5. Upload the zipped nodejs folder to s3. 
6. Set up the lambda layer in aws.
    1. Navigate to the lambda layer.
        - Open up the aws lambda service.
        - Lambda layer will be one of the options on the left panel.
    2. Click create layer and setup the layer.
        - Set the compatible runtime to Node.js 18.x. Otherwise, the layer will not be accessible from the lambda.
        - Set the code from the s3 bucket as the lambda layer's code.
7. Add the lambda layer to each lambda as a custom lambda layer.
    - There is a script, updateLambdaLayers.sh, that will update all of the lambdas' lambda layers. To run this script:
        - Set the environment variables for LAMDALAYER_ARN, and for the list of lambdas. 
        - Run the script using ./updateLambdaLayers.sh.