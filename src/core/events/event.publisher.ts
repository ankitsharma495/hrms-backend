import { logger } from '../logger/logger';

export type EventHandler = (data: any) => void | Promise<void>;

const handlers = new Map<string, EventHandler[]>();

export const eventPublisher = {
  emit(event: string, data: any) {
    logger.debug(`Event emitted: ${event}`, data);
    const listeners = handlers.get(event) || [];
    for (const handler of listeners) {
      Promise.resolve(handler(data)).catch((err) => {
        logger.error(`Event handler error for ${event}`, { error: err.message });
      });
    }
  },
};

export function registerHandler(event: string, handler: EventHandler) {
  const existing = handlers.get(event) || [];
  existing.push(handler);
  handlers.set(event, existing);
}
