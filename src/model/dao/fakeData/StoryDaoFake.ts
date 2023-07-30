import { FakeData } from "../../../util/FakeData";
import { PostStatusRequest, Status, StoryFeedRequest } from "../../entities";
import { IStoryDao } from "../IDaoFactory";

export class StoryDaoFake implements IStoryDao {

    private fakeData = FakeData.instance;
    
    async getStoryList(request: StoryFeedRequest): Promise<[Status[], boolean]> {
        let allStatuses = this.fakeData.fakeStatuses;

        let statusIndex = request.lastItem == null ? 0 : allStatuses.findIndex(status => status.user.alias == request.lastItem?.user.alias && status.timestamp == request.lastItem.timestamp);
        if(statusIndex == -1) throw Error("status not found for status:\n" + JSON.stringify(request.lastItem));
        
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