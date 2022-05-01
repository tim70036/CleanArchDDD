
import { SetAnnouncementUseCase } from './SetAnnouncementUseCase';
import { SetAnnouncementCTO } from './SetAnnouncementDTO';
import { BaseController } from '../../../../../../core/BaseController';
import * as express from 'express';
import { InternalServerError } from '../../../../../../common/CommonError';
class SetAnnouncementController extends BaseController {
    private readonly useCase: SetAnnouncementUseCase;

    public constructor (useCase: SetAnnouncementUseCase) {
        super();
        this.useCase = useCase;
    }

    public async Run (req: express.Request, res: express.Response): Promise<void> {
        const cto: SetAnnouncementCTO = req.body as SetAnnouncementCTO;

        try {
            const result = await this.useCase.Execute(cto);

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

export { SetAnnouncementController };
