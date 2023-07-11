import { IDaoFactory, ITokenDao } from "../dao/IDaoFactory";
import { AuthToken } from "../domain/AuthToken";

export class TokenService{

    private tokenDao: ITokenDao;

    constructor(daoFactory: IDaoFactory){
        this.tokenDao = daoFactory.getTokenDao();
    }

    async validateToken(token: AuthToken): Promise<void>{
        let databaseToken = await this.tokenDao.getToken(token.token);
        if(databaseToken == null) throw new Error('token not found in database for token: ' + token.token);
        else {
            let maxTimeMinutes = 20;
            let maxTimeMs = maxTimeMinutes * 60 * 100;
            let timeBetweenMs = 0;
            // let timeBetweenMs = Date.now() - databaseToken.datetime;
            if(timeBetweenMs > maxTimeMinutes) throw new Error('token has timed out after: ' + timeBetweenMs / 60 / 100 + ' minutes, with max timeout ' + maxTimeMinutes + '.');
            else this.tokenDao.updateTokenTimestamp(token.token, Date.now());
        }
    }
}