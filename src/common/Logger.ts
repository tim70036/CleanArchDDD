import winston from "winston";

function CreateLogger(name: string): winston.Logger {
  return winston.createLogger({
    defaultMeta: { name: name },
    level: process.env.LOG_LEVEL ?? "info", // Do not use low level in production.
    format: winston.format.errors({ stack: true }), // This must be the first format and before transport. Otherwise, the stack will be dropped.
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          process.env.LOG_FORMAT === "pretty"
            ? winston.format.prettyPrint({ colorize: true })
            : winston.format.json(),
        ),
      }),
    ],
  });
}

export { CreateLogger };
