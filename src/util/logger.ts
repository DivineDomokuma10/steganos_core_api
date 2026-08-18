type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

type LogContext = Record<string, unknown>;

const LEVELS: Record<LogLevel, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

const SENSITIVE_KEY = /auth|cookie|token|password|secret|authorization/i;

function isSensitiveValue(value: string): boolean {
  return (
    /Bearer\s+/i.test(value) ||
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function redact(value: unknown, seen = new WeakSet()): unknown {
  if (typeof value === "string") {
    return isSensitiveValue(value) ? "[REDACTED]" : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, seen));
  }

  if (isObject(value)) {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);

    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = SENSITIVE_KEY.test(key) ? "[REDACTED]" : redact(val, seen);
    }
    return out;
  }

  return value;
}

class Logger {
  private readonly threshold: number;

  constructor(level: LogLevel) {
    this.threshold = LEVELS[level];
  }

  private write(level: LogLevel, msg: string, context?: LogContext) {
    if (LEVELS[level] < this.threshold) return;

    const entry = {
      level,
      time: new Date().toISOString(),
      msg,
      ...(context ? (redact(context) as LogContext) : {}),
    };

    const line = JSON.stringify(entry);

    if (level === "fatal" || level === "error") {
      process.stderr.write(line + "\n");
    } else {
      process.stdout.write(line + "\n");
    }
  }

  fatal(msg: string, context?: LogContext) {
    this.write("fatal", msg, context);
  }

  error(msg: string, context?: LogContext) {
    this.write("error", msg, context);
  }

  warn(msg: string, context?: LogContext) {
    this.write("warn", msg, context);
  }

  info(msg: string, context?: LogContext) {
    this.write("info", msg, context);
  }

  debug(msg: string, context?: LogContext) {
    this.write("debug", msg, context);
  }

  trace(msg: string, context?: LogContext) {
    this.write("trace", msg, context);
  }
}

export const logger = new Logger(
  process.env.NODE_ENV === "production" ? "info" : "debug",
);
