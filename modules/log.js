function getLogger(module) {

    const path = module.filename.split('/').slice(-2).join('/'),
        {createLogger, format, transports} = require('winston'),
        {combine, timestamp, label, simple} = format,
        logger = createLogger({
            format: combine(
                label({label: path}),
                timestamp(),
                simple()
            ),
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: __dirname + '/log_error.log',
                    level: 'error'
                })
            ]
        });
    return logger;
}

module.exports = getLogger;