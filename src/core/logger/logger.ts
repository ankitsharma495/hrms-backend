import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, meta?: Record<string, any>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    console.log(formatMessage('info', message, meta));
  },
  warn(message: string, meta?: Record<string, any>) {
    console.warn(formatMessage('warn', message, meta));
  },
  error(message: string, meta?: Record<string, any>) {
    console.error(formatMessage('error', message, meta));
  },
  debug(message: string, meta?: Record<string, any>) {
    if (env.NODE_ENV === 'development') {
      console.log(formatMessage('debug', message, meta));
    }
  },
};
