import * as express from "express";
import { CreateLogger } from "../../../common/Logger";
import { StatusCode } from "../../../common/StatusCode";
import { DuplicatedError } from "../../../common/CommonError";
import { identityContainer } from "../../../command/identity/container";
import { ISessionService } from "../../../command/identity/domain/service/ISessionService";

const logger = CreateLogger("SessionAuth");
const sessionService =
  identityContainer.resolve<ISessionService>("ISessionService");
async function SessionAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    const token = req.headers.jwt as string;
    const sessionOrError = await sessionService.Auth(token);

    if (sessionOrError.IsFailure()) {
      logger.info(`auth failed`, {
        ip: req.ips,
        method: req.method,
        url: req.originalUrl,
        error: sessionOrError,
      });

      if (sessionOrError instanceof DuplicatedError) {
        res.sendStatus(StatusCode.PreconditionFailed);
        return;
      }

      res.sendStatus(StatusCode.Unauthorized);
      return;
    }

    const session = sessionOrError.Value;
    logger.debug(`authorized`, {
      uid: session.id.Value,
    });
    req.session = session;
    next();
    return;
  } catch (error) {
    logger.error(error);
    res.sendStatus(StatusCode.InternalServerError);
  }
}

export { SessionAuth };
