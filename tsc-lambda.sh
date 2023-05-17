# tsc-lambda.sh
#!/bin/bash

# use set -e to terminate the script on error
set -e

rm -rf build

# transpile the typescript into javascript according to the tsconfig.json specifications
npx tsc

# Typically, the .env file will have different secrets in the local environment and the live environment.
# However, in this project, I use the same variable values locally and live. 
# The only use case for .env in this project then is to hide its secrets from github (see the .gitignore file).
cp .env build

# move into the build folder so that the contents are zipped with one less parent folder at the top.
cd build

# # zip the contents using 7-zip. This will have to be installed and added to the windows environment system path variable.
7z a -tzip typescript-complete.zip -r

# in order for source to work, each line in the .env file is treated as a command. 
# This means that if a variable in .env spans multiple lines this command will fail.
source .env

aws s3 cp typescript-complete.zip s3://$BUCKET

echo typescript-complete.zip uploaded to the bucket. Updating lambda functions...

echo '' > lambdaupdate.log
aws lambda update-function-code \
    --function-name  tweeter-register-javascript \
    --s3-bucket $BUCKET \
    --s3-key typescript-complete.zip 1>>lambdaupdate.log

echo Lambda functions updated. See lambdaupdate.log for standard output.