import { Controller } from '../../../../../core/Controller';
import * as express from 'express';
import { InternalServerError } from '../../../../../common/CommonError';
import { SwitchOffUseCase } from './SwitchOffUseCase';
import { maintenanceContainer } from '../../../container';
class SwitchOffController extends Controller {
    private readonly useCase = maintenanceContainer.resolve(SwitchOffUseCase);

    protected async Run (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.useCase.Execute();

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

export { SwitchOffController };
