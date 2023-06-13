import { FakeData } from "../../../util/FakeData";
import { Status } from "../../domain/Status";
import { IFeedDao } from "../IDaoFactory";

export class FeedDaoFake implements IFeedDao {

    private fakeData = FakeData.instance;
    
    async getFeedList(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean]> {
        let allStatuses = this.fakeData.fakeStatuses;

        let statusIndex = lastStatus == null ? 0 : allStatuses.findIndex(status => status.user.alias == lastStatus?.user.alias && status.timestamp == lastStatus.timestamp);
        if(statusIndex == -1) throw Error("status not found for status:\n" + JSON.stringify(lastStatus));
        
        let length = allStatuses.length;
        let remainingStatusesCount = length -statusIndex;
        let returnStatusesCount = remainingStatusesCount > 10 ? 10 : remainingStatusesCount;

        //make sure to use 'slice' and not 'splice' since splice changes the original array.
        let responseStatuses = allStatuses.slice(statusIndex, statusIndex + returnStatusesCount);
        let hasMorePages = remainingStatusesCount > limit;
        return [responseStatuses, hasMorePages];
    }
    async putFeeds(authorAlias: string, post: string, timestamp: number): Promise<void> {
        return;
    }
    
}