// RabbitMQ queue placeholder
// Enable when RABBITMQ_URL is configured in .env

import { env } from '../config/env';

export async function connectQueue() {
  if (!env.RABBITMQ_URL) {
    return null;
  }
  // Placeholder for future RabbitMQ integration
  return null;
}

export async function publishToQueue(queue: string, message: any) {
  // Placeholder
}
