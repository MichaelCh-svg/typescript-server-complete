import { FakeData } from "../../../util/FakeData";
import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { StoryFeedRequest, PostStatusRequest } from "../net/Request";

export class StoryDaoFake implements IStoryDao {

    private fakeData = FakeData.instance;
    
    async getStoryList(request: StoryFeedRequest): Promise<[Status[], boolean]> {
        let allStatuses = this.fakeData.fakeStatuses;

        let statusIndex = request.lastStatus == null ? 0 : allStatuses.findIndex(status => status.user.alias == request.lastStatus?.user.alias && status.timestamp == request.lastStatus.timestamp);
        if(statusIndex == -1) throw Error("status not found for status:\n" + JSON.stringify(request.lastStatus));
        
        let length = allStatuses.length;
        let remainingStatusesCount = length -statusIndex;
        let returnStatusesCount = remainingStatusesCount > 10 ? 10 : remainingStatusesCount;

        //make sure to use 'slice' and not 'splice' since splice changes the original array.
        let responseStatuses = allStatuses.slice(statusIndex, statusIndex + returnStatusesCount);
        let hasMorePages = remainingStatusesCount > request.limit;
        return [responseStatuses, hasMorePages];
    }
    async putStory(event: PostStatusRequest): Promise<void> {
        return;
    }
    
}