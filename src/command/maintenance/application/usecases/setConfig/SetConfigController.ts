
import { SetConfigCTO } from './SetConfigDTO';
import { Controller } from '../../../../../core/Controller';
import * as express from 'express';
import { InternalServerError } from '../../../../../common/CommonError';
import { SetConfigUseCase } from './SetConfigUseCase';
class SetConfigController extends Controller {
    private readonly useCase: SetConfigUseCase;

    public constructor (useCase: SetConfigUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: SetConfigCTO = req.body as SetConfigCTO;

        try {
            const result = await this.useCase.Execute(cto);

            if (result.IsFailure()) {
                this.Fail(res, result);
                return;
            }

            this.Success(res, null);
            return;
        } catch (error) {
            this.Fail(res, new InternalServerError(`${(error as Error).stack}`));
            return;
        }
    }
}

export { SetConfigController };
