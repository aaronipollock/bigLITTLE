import pino from 'pino';
import { config } from './config';

const options = {
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',

    ...(config.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty'}} : {})
}

export const logger = pino(options)
