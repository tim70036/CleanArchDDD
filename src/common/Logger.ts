import winston from 'winston';
import dayjs from 'dayjs'

export function CreateLogger (name: string): winston.Logger {
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL ?? 'info', // Do not use low level in production.
        transports: [
            // TODO https://github.com/winstonjs/logform#formats
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.errors({ stack: true }),
                    winston.format.cli(),
                    winston.format.timestamp(),
                    winston.format.printf((log) => `${dayjs(log.timestamp).format('YYYY-MM-DD hh:mm:ss.SSS Z')} [${process.pid}]  [${name}] [${log.level}]    ${log.message}`),
                ),
            }),
        ],
    });

    return logger;
}
