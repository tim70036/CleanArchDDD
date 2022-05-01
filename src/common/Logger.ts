import winston from 'winston';
import moment from 'moment';

export function CreateLogger (name: string): winston.Logger {
    const logger = winston.createLogger({
        level: 'info',
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((log) => `${moment(log.timestamp).format('YYYY-MM-DD hh:mm:ss.SSS Z')}  [${name}] [${log.level}]    ${log.message}`),
                ),
            }),
        ],
    });

    return logger;
}
