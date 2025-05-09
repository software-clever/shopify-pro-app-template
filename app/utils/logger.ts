type LogLevel = "debug" | "info" | "warn" | "error";

/** Accepted signature for all levels */
interface LogFn {
  (msg: string): void;
  (obj: Record<string, unknown>, msg: string): void;
}

export interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

/* -------------------------------------------------- */
/* Internals                                          */
/* -------------------------------------------------- */

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const colours: Record<LogLevel, string> = {
  debug: "\x1b[90m", // grey
  info: "\x1b[32m",  // green
  warn: "\x1b[33m",  // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return (
    levelPriority[level] >= levelPriority[currentLevel]
  );
}

function stringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

function _write(
  level: LogLevel,
  first: unknown,
  maybeMsg?: string,
): void {
  if (!shouldLog(level)) return;

  const colour = colours[level];
  const timestamp = new Date().toISOString();

  if (typeof first === "string") {
    console.log(
      `${colour}[${timestamp}] ${level.toUpperCase()}: ${first}${RESET}`,
    );
  } else {
    console.log(
      `${colour}[${timestamp}] ${level.toUpperCase()}: ${maybeMsg ?? ""
      }${RESET} ${stringify(first)}`,
    );
  }
}

const makeLogFn = (lvl: LogLevel): LogFn =>
  (arg1: any, arg2?: any) => _write(lvl, arg1, arg2);

/* Public logger --------------------------------------------------------- */

const logger: Logger = {
  debug: makeLogFn("debug"),
  info:  makeLogFn("info"),
  warn:  makeLogFn("warn"),
  error: makeLogFn("error"),
};

export default logger;