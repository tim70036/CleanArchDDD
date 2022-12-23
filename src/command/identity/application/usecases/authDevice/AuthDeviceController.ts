import * as express from 'express';
import { AuthDeviceUseCase } from './AuthDeviceUseCase';
import { AuthDeviceCTO } from './AuthDeviceDTO';
import { InternalServerError } from '../../../../../common/CommonError';
import { Controller } from '../../../../../core/Controller';

class AuthDeviceController extends Controller {
    private readonly useCase: AuthDeviceUseCase;

    public constructor (useCase: AuthDeviceUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: AuthDeviceCTO = req.body as AuthDeviceCTO;

        try {
            const sessionOrError = await this.useCase.Execute(cto);
            if (sessionOrError.IsFailure()) {
                this.Fail(res, sessionOrError);
                return;
            }

            const session = sessionOrError.Value;
            this.Success(res, { uid: session.id.Value, jwt: session.props.jwt });
            return;
        } catch (error) {
            this.Fail(res, new InternalServerError(`${(error as Error).stack}`));
            return;
        }
    }
}

export { AuthDeviceController };
