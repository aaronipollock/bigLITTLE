import pino from 'pino';
import { config } from './config';

const level =
    config.NODE_ENV === 'test' ? 'silent'
    : config.NODE_ENV === 'development' ? 'debug'
    : 'info';

const options = {
    level,

    ...(config.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty'}} : {}),

    redact: ['req.headers.authorization', 'req.headers.cookie']
}

export const logger = pino(options)
