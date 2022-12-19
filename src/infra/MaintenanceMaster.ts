import moment, { Moment } from 'moment';
import { MaintenanceStatus } from '../command/maintenance/domain/model/MaintenanceStatus';
import { ConfigService } from '../command/maintenance/infra/service/ConfigService';
import { CreateLogger } from '../common/Logger';
import { GetConfigService } from '../query/maintenance/infra/service/GetConfigService';

class MaintenanceMaster {
    private readonly refreshInterval = 30000; // Miliseconds

    private readonly logger = CreateLogger('MaintenanceMaster');

    private readonly getConfigService: GetConfigService;

    private readonly configService: ConfigService;

    private startTime: Moment = moment('1996-07-18').utc();

    private announcement: string = '';

    private ipWhitelist: string[] = [];

    private status: MaintenanceStatus = MaintenanceStatus.BlockAll;

    public constructor () {
        this.getConfigService = new GetConfigService();
        this.configService = new ConfigService();
    }

    public get StartTime (): Moment {
        return this.startTime;
    }

    public get Announcement (): string {
        return this.announcement;
    }

    public get IpWhitelist (): string[] {
        return this.ipWhitelist;
    }

    public get Status (): MaintenanceStatus {
        return this.status;
    }

    public Init (): void {
        this.UpdateMaintenanceSetting();
        setInterval(this.UpdateMaintenanceSetting, this.refreshInterval);
    }

    private readonly UpdateMaintenanceSetting = async (): Promise<void> => {
        try {
            const configOrError = await this.getConfigService.Get();
            if (configOrError.IsFailure()) {
                this.logger.error(`get config service error[${configOrError.Error}]`);
                return;
            }

            const config = configOrError.Value;
            this.startTime = moment(config.startTime).utc();
            this.announcement = config.announcement;
            this.ipWhitelist = config.ipWhitelist;
            this.status = Number(config.status);
            this.logger.info(`retreived config startTime[${this.startTime.format()}] status[${this.status}] ipWhitelist[${this.ipWhitelist}]`);

            if (this.ShouldMaintenanceStart(this.startTime) && config.status === MaintenanceStatus.Off.toString()) {
                await this.configService.SetStatus(MaintenanceStatus.AllowWhitelist);
                this.status = MaintenanceStatus.AllowWhitelist;
                this.logger.info(`maintenance starts with time[${this.startTime.format()}] status[${MaintenanceStatus.AllowWhitelist}]`);
            }
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
        }
    };

    private ShouldMaintenanceStart (startTime: Moment): boolean {
        const now = moment().utc();
        const milisecSinceStartTime = moment.duration(now.diff(startTime)).asMilliseconds();

        return (milisecSinceStartTime >= 0 && milisecSinceStartTime < this.refreshInterval * 2);
    }
}

const maintenanceMaster = new MaintenanceMaster();

export { maintenanceMaster };
