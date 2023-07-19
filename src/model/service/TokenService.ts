import { IDaoFactory, ITokenDao } from "../dao/IDaoFactory";
import { AuthToken } from "../entities";

export class TokenService{

    private tokenDao: ITokenDao;
    static timeoutInMinutes = 20;

    constructor(daoFactory: IDaoFactory){
        this.tokenDao = daoFactory.getTokenDao();
    }

    async validateToken(token: AuthToken): Promise<void>{
        let databaseToken = await this.tokenDao.getToken(token.token);
        if(databaseToken == null) throw new Error('token not found in database for token: ' + token.token);
        else {
            let timeBetweenMs = Date.now() - databaseToken.timestamp;
            let timeBetweenMinutes = timeBetweenMs / 1000 / 60;
            if(timeBetweenMinutes > TokenService.timeoutInMinutes) {
                await this.tokenDao.deleteToken(token.token);
                throw new Error('token has timed out after: ' + timeBetweenMinutes + ' minutes, with max timeout ' + TokenService.timeoutInMinutes + '.');
            }
            else this.tokenDao.updateTokenTimestamp(token.token, Date.now());
        }
    }
}