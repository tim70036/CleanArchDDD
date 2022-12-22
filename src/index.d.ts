/* eslint-disable no-unused-vars */
declare namespace Express {
    // https://stackoverflow.com/a/51114250
     type Session = import('./command/identity/domain/model/Session').Session;
     export interface Request {
        session: Session;
    }
}
