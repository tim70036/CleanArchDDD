import * as express from 'express';
import { AuthLineUseCase } from './AuthLineUseCase';
import { AuthLineCTO } from './AuthLineDTO';
import { InternalServerError } from '../../../../../common/CommonError';
import { Controller } from '../../../../../core/Controller';

class AuthLineController extends Controller {
    private readonly useCase: AuthLineUseCase;

    public constructor (useCase: AuthLineUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: AuthLineCTO = req.body as AuthLineCTO;

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

export { AuthLineController };
