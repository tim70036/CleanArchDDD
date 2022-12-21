import { CreateLogger } from '../common/Logger';

abstract class Subscriber {
    protected logger;

    protected constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public abstract Init (): void;
}

export { Subscriber };
