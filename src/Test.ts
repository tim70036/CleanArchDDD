import { InvalidDataError } from './common/CommonError';
import { CreateLogger } from './common/Logger';

const logger = CreateLogger('test');
const err = new InvalidDataError(`fffff`);

logger.error(err.toString());
logger.error(err);
logger.error(`hasdhashdahs ${err}`);


