import { Controller } from '../../../../../core/Controller';
import * as express from 'express';
import { InternalServerError } from '../../../../../common/CommonError';
import { SwitchOffUseCase } from './SwitchOffUseCase';
class SwitchOffController extends Controller {
    private readonly useCase: SwitchOffUseCase;

    public constructor (useCase: SwitchOffUseCase) {
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

            this.Success(res, null);
            return;
        } catch (err: unknown) {
            this.Fail(res, new InternalServerError(`${(err as Error).stack}`));
            return;
        }
    }
}

export { SwitchOffController };
