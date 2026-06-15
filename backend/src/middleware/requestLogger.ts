import pinoHttp from 'pino-http';
import { logger } from '../logger';
import { randomUUID } from 'node:crypto';

const options = {
    logger,
    genReqId: () => randomUUID()
};

export const requestLogger = pinoHttp( options );
