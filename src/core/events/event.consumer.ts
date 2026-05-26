import { registerHandler, EventHandler } from './event.publisher';
import { logger } from '../logger/logger';

export function consumeEvent(event: string, handler: EventHandler) {
  logger.info(`Registered consumer for event: ${event}`);
  registerHandler(event, handler);
}
