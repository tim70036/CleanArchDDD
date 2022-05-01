
import { DeleteAnnouncementUseCase } from './DeleteAnnouncementUseCase';
import { Controller } from '../../../../../../core/Controller';
import * as express from 'express';
import { InternalServerError } from '../../../../../../common/CommonError';

class DeleteAnnouncementController extends Controller {
    private readonly useCase: DeleteAnnouncementUseCase;

    public constructor (useCase: DeleteAnnouncementUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
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

export { DeleteAnnouncementController };
