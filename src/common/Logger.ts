import winston from 'winston';
import moment from 'moment';

export function CreateLogger (name: string): winston.Logger {
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL ?? 'info', // Do not use low level in production.
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((log) => `${moment(log.timestamp).format('YYYY-MM-DD hh:mm:ss.SSS Z')} [${process.pid}]  [${name}] [${log.level}]    ${log.message}`),
                ),
            }),
        ],
    });

    return logger;
}
