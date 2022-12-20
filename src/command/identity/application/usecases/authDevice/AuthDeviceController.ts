import * as express from 'express';
import { AuthDeviceUseCase } from './AuthDeviceUseCase';
import { AuthDeviceCTO } from './AuthDeviceDTO';
import { InternalServerError, UnavailableError } from '../../../../../common/CommonError';
import { Controller } from '../../../../../core/Controller';

class AuthDeviceController extends Controller {
    private readonly useCase: AuthDeviceUseCase;

    public constructor (useCase: AuthDeviceUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: AuthDeviceCTO = req.body as AuthDeviceCTO;
        cto.ip = req.ip;

        try {
            const result = await this.useCase.Execute(cto);

            if (result.IsFailure()) {
                this.Fail(res, result);
                return;
            }

            const user = result.Value;

            // const sessionOrError = await this.jwtSessionService.CreateSession(user.Id, req.ip);
            // if (sessionOrError.IsFailure()) {
            //     this.logger.error(sessionOrError.Error);
            //     this.Fail(res, sessionOrError);
            //     return;
            // }

            const session = sessionOrError.Value;

            const payload = {
                jwt: session.Jwt
            };

            this.Success(res, payload);
            return;
        } catch (err: unknown) {
            this.Fail(res, new InternalServerError(`${(err as Error).stack}`));
            return;
        }
    }
}

export { AuthDeviceController };
