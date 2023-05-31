# use set -e to terminate the script on error
set -e

source .env

aws lambda update-event-source-mapping \
    --function-name $SQS1LAMBDA \
    --uuid $SQS1LAMBDA_UUID \
    --no-enabled
aws lambda update-event-source-mapping \
    --function-name $SQS2LAMBDA \
    --uuid $SQS2LAMBDA_UUID \
    --no-enabled

