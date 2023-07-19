// Import required AWS SDK clients and commands for Node.js
import { SQSClient, SendMessageCommand } from  "@aws-sdk/client-sqs";
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";
import { PostStatusRequest, Response } from "../../entities";
import { FeedDaoFace } from "./FeedDaoFace";
import { StoryDao } from "./StoryDAO";


let sqsClient = new SQSClient({ region: process.env.REGION })



export async function postStatusToSQSFromSQSService(event: PostStatusRequest) {
    // Set the parameters
  let timestamp = new Date().getTime();
  let request = new PostStatusToSQSRequest(event.user.alias, event.post, timestamp);
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

export async function postStatusToSQS(event: PostStatusRequest){
  await postStatusToSQSFromSQSService(event);
  return new Response(true, event.user.alias + " posted " + event.post);
}
export async function postStatusFromSQSService(event: PostStatusToSQSRequest){
  let storyDao = new StoryDao();
  let feedDao = new FeedDaoFace();
  await storyDao.putStory(event.alias, event.timestamp, event.post);
  await feedDao.putFeeds(event.alias, event.post, event.timestamp);

  return new Response(true, event.alias + " posted " + event.post + " at " + event.timestamp);
}

