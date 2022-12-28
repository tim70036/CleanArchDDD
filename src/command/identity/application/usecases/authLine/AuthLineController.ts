import * as express from 'express';
import { AuthLineUseCase } from './AuthLineUseCase';
import { AuthLineCTO } from './AuthLineDTO';
import { InternalServerError } from '../../../../../common/CommonError';
import { Controller } from '../../../../../core/Controller';
import { identityContainer } from '../../../container';

class AuthLineController extends Controller {
    private readonly useCase = identityContainer.resolve(AuthLineUseCase);

    protected async Run (req: express.Request, res: express.Response): Promise<void> {
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
        } catch (error) {
            this.Fail(res, new InternalServerError(`${(error as Error).stack}`));
            return;
        }
    }
}

export { AuthLineController };
