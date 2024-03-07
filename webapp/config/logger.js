import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: './logs/app.log' }),
  ]
});

export default logger;

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp(),
//     format.json()
//   ),
//   transports: [
//     new transports.Console(), // Log to console
//     new transports.File({ filename: './logs/app.log' }), // Log to app.log
//   ]
// });

// const logToFile = async (filePath, message) => {
//   try {
//     await appendFile(filePath, message);
//     logger.info(`Log message written to ${filePath}`);
//   } catch (error) {
//     logger.error(`Error writing log message to ${filePath}: ${error}`);
//   }
// };

// export { logger, logToFile };