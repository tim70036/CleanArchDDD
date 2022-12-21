import * as express from 'express';
import { InternalServerError } from '../../../../../common/CommonError';
import { Controller } from '../../../../../core/Controller';
import { AuthPasswordUseCase } from './AuthPasswordUseCase';
import { AuthPasswordCTO } from './AuthPasswordDTO';

class AuthDeviceController extends Controller {
    private readonly useCase: AuthPasswordUseCase;

    public constructor (useCase: AuthPasswordUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: AuthPasswordCTO = req.body as AuthPasswordCTO;

        try {
            const sessionOrError = await this.useCase.Execute(cto);
            if (sessionOrError.IsFailure()) {
                this.Fail(res, sessionOrError);
                return;
            }

            const session = sessionOrError.Value;
            this.Success(res, { uid: session.id.Value, jwt: session.props.jwt });
            return;
        } catch (err: unknown) {
            this.Fail(res, new InternalServerError(`${(err as Error).stack}`));
            return;
        }
    }
}

export { AuthDeviceController };
