import { AuthToken } from "../../entities";
import { ITokenDao } from "../IDaoFactory";

export class TokenDaoFake implements ITokenDao{
    async deleteToken(token: String): Promise<void> {
        return;
    }
    async clearExpiredTokens(expireTimeInMinutes: number): Promise<void> {
        return;
    }
    async getToken(token: string): Promise<[AuthToken, string] | null> {
        return [AuthToken.Generate(), '@allen'];
    }
    async updateTokenTimestamp(token: string, timestamp: number): Promise<void> {
        return;
    }
    async putToken(token: AuthToken, username: string): Promise<void> {
        return;
    }
    
}