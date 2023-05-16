# tsc-lambda.sh
#!/bin/bash

# use set -e to terminate the script on error
set -e

rm -rf build

# transpile the typescript into javascript according to the tsconfig.json specifications
npx tsc

# move into the build folder so that the contents are zipped with one less parent folder at the top.
cd build

# zip the contents using 7-zip. This will have to be installed and added to the windows environment system path variable.
7z a -tzip src.zip -r
aws lambda update-function-code --function-name tweeter-login-javascript --zip-file fileb://./src.zip 2>&1 > tsc.log
# use >> to append to tsc.log without erasing the current contents.
aws lambda update-function-code --function-name tweeter-postStatus-typescript --zip-file fileb://./src.zip 2>&1 >> tsc.log
aws lambda update-function-code --function-name tweeter-register-javascript --zip-file fileb://./src.zip 2>&1 >> tsc.log
echo Lambda upload command finished, check tsc.log in the build folder in case of error.