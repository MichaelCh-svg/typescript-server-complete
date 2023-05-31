# tsc-lambda.sh
#!/bin/bash

# use set -e to terminate the script on error
set -e

rm -rf build/

# transpile the typescript into javascript according to the tsconfig.json specifications.
# Some files will be excluded from this transpile, see the tsconfig.json exclude property.
npx tsc

# Typically, the .env file will have different secrets in the local environment and the live environment.
# However, in this project, I use the same variable values locally and live. 
# The only use case for .env in this project then is to hide its secrets from github (see the .gitignore file).
# Environment variables can also be configured as a lambda setting.
cp .env build

# move into the build folder so that the contents are zipped with one less parent folder at the top.
cd build

# # zip the contents using 7-zip. 7-zip will have to be installed and added to the windows environment system path variable.
7z a -tzip typescript-complete.zip -r

# in order for source to work, each line in the .env file is treated as a command. 
# This means that if a variable in .env spans multiple lines this command will fail.
source .env

aws s3 cp typescript-complete.zip s3://$BUCKET

echo -e 'typescript-complete.zip uploaded to the bucket. Updating lambda functions...\n'

# Updating the s3 code doesn't update the lambdas, which make a copy of the s3 code.
# The lambedas have to reload their code source to get the updated s3 code.
i=1
for lambda in $LAMBDALIST
do
    aws lambda update-function-code \
        --function-name  $lambda \
        --s3-bucket $BUCKET \
        --s3-key typescript-complete.zip \
        1>>/dev/null \
        &
        # The & runs this command in the background so we can update all lambdas simultaneously 
        # redirecting standard output to /dev/null just means that it doesn't get saved anywhere
        # standard error should still show up in the terminal as it is represented by the number 2 instead of 1
    echo lambda $i, $lambda, uploaded
    ((i=i+1))
done


# using -e let's us use escape characters such as \n if the output is in quotation marks
echo -e '\nLambda functions updated. Standard output is redirected to /dev/null and so it is not visible, but standard errors should show up in the terminal.'