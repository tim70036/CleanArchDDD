
import { GetConfigUseCase } from './GetConfigUseCase';
import { Controller } from '../../../../core/Controller';
import * as express from 'express';
import { InternalServerError } from '../../../../common/CommonError';

class GetConfigController extends Controller {
    private readonly useCase: GetConfigUseCase;

    public constructor (useCase: GetConfigUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.useCase.Execute();

            if (result.IsFailure()) {
                this.Fail(res, result);
                return;
            }

            const time = result.Value;

            this.Success(res, time);
            return;
        } catch (error) {
            this.Fail(res, new InternalServerError(`${(error as Error).stack}`));
            return;
        }
    }
}

export { GetConfigController };
