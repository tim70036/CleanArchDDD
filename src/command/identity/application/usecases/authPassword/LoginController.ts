
import { LoginUseCase } from './LoginUseCase';
import { LoginCTO } from './LoginDTO';
import { BaseController } from '../../../../../core/BaseController';
import * as express from 'express';
import { sign } from 'jsonwebtoken';
import { redisClient } from '../../../../../infra/database/RedisV4';
import moment from 'moment';
import { InternalServerError } from '../../../../../common/CommonError';

const sessionPrefix = `session:uid`;
class LoginController extends BaseController {
    private readonly useCase: LoginUseCase;

    public constructor (useCase: LoginUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: LoginCTO = req.body as LoginCTO;

        try {
            const result = await this.useCase.Execute(cto);

            if (result.IsFailure()) {
                this.Fail(res, result);
                return;
            }

            const user = result.Value;
            const jwtPayload = {
                uid: user.Id.Value
            };
            const jwt = sign(jwtPayload, process.env.JWT_KEY as string);

            const sessionData = JSON.stringify({
                uid: user.Id.Value,
                jwt: jwt,
                createTime: moment().utc().format(),
                lastHeartbeat: moment().utc().format(),
            });

            await redisClient.hSet(sessionPrefix, user.Id.Value, sessionData);

            const payload = {
                jwt: jwt
            };
            this.Success(res, payload);
            return;
        } catch (err: unknown) {
            this.Fail(res, new InternalServerError(`${(err as Error).stack}`));
            return;
        }
    }
}

export { LoginController };
