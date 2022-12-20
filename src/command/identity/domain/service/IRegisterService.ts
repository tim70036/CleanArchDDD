import { Service } from '../../../../core/Service';

interface IRegisterService extends Service {
    GenShortUid (): Promise<number>;
}

export {
    IRegisterService
};
