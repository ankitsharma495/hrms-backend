import express from 'express';
import cors from 'cors';
import { env } from './core/config/env';
import { createSchema } from './core/db/sequelize';
import { authMiddleware } from './middleware/auth.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import apiRoutes from './routes/index';
import { logger } from './core/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(authMiddleware);

app.use('/api', apiRoutes);

app.use(errorMiddleware);

createSchema()
  .then(() => {
    app.listen(env.PORT, () => {
      logger.info(`HRMS API running on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to create schema', { error: err.message });
    process.exit(1);
  });

export default app;
