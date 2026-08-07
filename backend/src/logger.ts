import pino from 'pino';
import { config } from './config';

const options = {
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',

    ...(config.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty'}} : {}),

    redact: ['req.headers.authorization', 'req.headers.cookie']
}

export const logger = pino(options)
