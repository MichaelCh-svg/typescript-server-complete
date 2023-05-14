# tsc-lambda.sh
#!/bin/bash

set -e

rm -rf build
npx tsc
cd build
7z a -tzip src.zip -r
aws lambda update-function-code --function-name tweeter-login-javascript --zip-file fileb://./src.zip 2>&1 > tsc.log
aws lambda update-function-code --function-name tweeter-register-javascript --zip-file fileb://./src.zip 2>&1 >> tsc.log
echo Lambda upload command finished, check tsc.log for more details.