import { AuthToken } from "../../domain/AuthToken";
import { ITokenDao } from "../IDaoFactory";

export class TokenDaoFake implements ITokenDao{
    async deleteToken(token: String): Promise<void> {
        return;
    }
    async clearExpiredTokens(expireTimeInMinutes: number): Promise<void> {
        return;
    }
    async getToken(token: string): Promise<AuthToken | null> {
        return AuthToken.Generate();
    }
    async updateTokenTimestamp(token: string, timestamp: number): Promise<void> {
        return;
    }
    async putToken(token: AuthToken): Promise<void> {
        return;
    }
    
}