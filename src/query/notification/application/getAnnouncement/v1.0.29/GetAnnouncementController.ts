
import { GetAnnouncementUseCase } from './GetAnnouncementUseCase';
import { BaseController } from '../../../../../core/BaseController';
import * as express from 'express';
import { InternalServerError } from '../../../../../common/CommonError';

class GetAnnouncementController extends BaseController {
    private readonly getAnnouncementUseCase: GetAnnouncementUseCase;

    public constructor (getAnnouncementUseCase: GetAnnouncementUseCase) {
        super();
        this.getAnnouncementUseCase = getAnnouncementUseCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.getAnnouncementUseCase.Execute();

            if (result.IsFailure()) {
                this.Fail(res, result);
                return;
            }

            const announcement = result.Value;

            this.Success(res, announcement);

            return;
        } catch (err: unknown) {
            this.Fail(res, new InternalServerError(`${(err as Error).stack}`));
            return;
        }
    }
}

export { GetAnnouncementController };
