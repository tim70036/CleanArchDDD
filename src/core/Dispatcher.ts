import * as express from 'express';
import semver from 'semver';
import { CreateLogger } from '../common/Logger';
import { Controller } from './Controller';

class Dispatcher {
    protected logger;

    protected versionMap: Map<string, Controller>;

    public constructor (versionMap: Map<string, Controller>) {
        this.logger = CreateLogger(this.constructor.name);
        const isValid = this.ValidateVersionMap(versionMap);
        if (!isValid)
            throw new Error('create versionMap fail');

        this.versionMap = versionMap;
    }

    public async Dispatch (req: express.Request, res: express.Response): Promise<void> {
        let reqVersion = req.headers[`api-version`];

        if (typeof reqVersion !== 'string')
            reqVersion = '';

        const version = this.GetVersion(reqVersion);

        this.logger.debug(`-> ${req.method} ${req.path}, req version: [${reqVersion}], dispatch to version [${version}]`);

        const matchedController = this.versionMap.get(version);
        if (typeof matchedController === 'undefined') {
            this.logger.error(`cannot find matched controller for version[${version}]`);
            return;
        }

        await matchedController.Execute(req, res);
    }

    private GetVersion (reqVersion: string): string {
        if (typeof this.versionMap.get(reqVersion) !== 'undefined')
            return reqVersion;

        const versions: string[] = Object.keys(this.versionMap);
        versions.sort(semver.compare);
        const minVersion = versions[0];

        if (reqVersion === '' || semver.valid(reqVersion) === null)
            return minVersion;

        versions.reverse();

        const floorVersion = versions.find((e) => (semver.gt(reqVersion, e)));

        if (typeof floorVersion === 'undefined')
            return minVersion;

        return floorVersion;
    }

    private ValidateVersionMap (versionMap: Map<string, Controller>): boolean {
        const versions: string[] = Array.from(versionMap.keys());
        const invalidVersion = versions.find((e) => semver.valid(e) === null);

        if (typeof invalidVersion !== 'undefined') {
            this.logger.error(`VerionMap with invalid version [${invalidVersion}]`);
            return false;
        }
        return true;
    }
}

export {
    Dispatcher
};
