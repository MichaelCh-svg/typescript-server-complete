
# Use this file to update the lambda layers for each lambda.

source .env

i=1
PID=0
pids=()
for lambda in $LAMBDALIST
do
    aws lambda update-function-configuration --function-name  $lambda --layer $LAMBDALAYER_ARN 1>>/dev/null & 
    echo lambda $i, $lambda, updating lambda layer
    pids[${i-1}]=$!
    ((i=i+1))
done
for pid in ${pids[*]}; do
    wait $pid
done
echo lambda layers updated for all lambdas in .env