import { Repo } from "../../../../core/Repo";
import { Session } from "../model/Session";

abstract class ISessionRepo extends Repo<Session> {}

export { ISessionRepo };
