// Import required AWS SDK clients and commands for Node.js
import { SQSClient, SendMessageCommand } from  "@aws-sdk/client-sqs";
import * as dotenv from 'dotenv'
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";
import { PostStatusRequest } from "../net/request/PostStatusRequest";
dotenv.config()

let sqsClient = new SQSClient({ region: process.env.REGION })



export async function postStatusToSQSFromSQSService(event: PostStatusRequest) {
    // Set the parameters
  let timestamp = new Date().getTime();
  let request = new PostStatusToSQSRequest(event.alias, event.post, timestamp);
  const params = {
    DelaySeconds: 10,
    MessageBody:
      JSON.stringify(request),
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: process.env.SQS1 //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
  };
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
    return data; // For unit tests.
  } catch (err) {
    throw err;
  }
};

export async function postFeedToSQSFromSQSService(event: PostFeedToSQSRequest) {
  // Set the parameters
const params = {
  DelaySeconds: 10,
  MessageBody:
    JSON.stringify(event),
  // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
  // MessageGroupId: "Group1",  // Required for FIFO queues
  QueueUrl: process.env.SQS2 //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
};
try {
  const data = await sqsClient.send(new SendMessageCommand(params));
  console.log("Success, message sent. MessageID:", data.MessageId);
  return data; // For unit tests.
} catch (err) {
  throw err;
}
};

