import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { logger } from './logger';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import meditationRoutes from './routes/meditations';
import usageEventRoutes from './routes/usageEvents';

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    return res.status(200).json({ status: 'ok' });
});

app.use("/auth", authRoutes);
app.use("/meditations", meditationRoutes);
app.use("/usage-events", usageEventRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, "server listening")
})
