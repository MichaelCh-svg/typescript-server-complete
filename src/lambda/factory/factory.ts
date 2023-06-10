import { FollowService } from "../../model/service/FollowService";
import { UserService } from "../../model/service/UserService";
import { IDaoFactory } from "../../model/dao/IDaoFactory";
import { DynamoFactory } from "../../model/dao/dynamo/DynamoFactory";
import { StatusService } from "../../model/service/StatusService";

let factory: IDaoFactory = new DynamoFactory();

export function getFollowService(): FollowService{ return new FollowService(factory)}
export function getUserService(): UserService{ return new UserService(factory)}
export function getStatusService(): StatusService{ return new StatusService(factory)}