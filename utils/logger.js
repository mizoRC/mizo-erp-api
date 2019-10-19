import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const loggerTransports = {
  console: new transports.Console()
};

let logger;

logger = createLogger({
  	level: "info",
	format: combine(
		colorize(),
		label({ label: 'MIZO-ERP-API' }),
		timestamp(),
		myFormat
	),
	transports: [
		loggerTransports.console
	]
});

const setDebugLevel = () => {
	loggerTransports.console.level="debug";
};

logger.setDebugLevel = setDebugLevel;

export default logger;