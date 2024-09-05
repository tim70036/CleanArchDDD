import winston from 'winston';

function CreateLogger (name: string): winston.Logger {
    return winston.createLogger({
        defaultMeta: { name: name },
        level: process.env.LOG_LEVEL ?? 'info', // Do not use low level in production.
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.errors({ stack: true }),

                    process.env.LOG_FORMAT === 'pretty' ? winston.format.prettyPrint({ colorize: true }) : winston.format.json(),
                ),
            }),
        ],
    });
}

export { CreateLogger };
