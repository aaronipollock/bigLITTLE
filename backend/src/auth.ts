import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from './config';


export const hashPassword = (plain: string) => {
    return bcrypt.hash(plain, 12)
}

export const verifyPassword = (plain: string, hash: string) => {
    return bcrypt.compare(plain, hash)
}

const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn']
};

export const signToken = (caregiverId: number) => {
    return jwt.sign(
        { sub: String(caregiverId) },
        config.JWT_SECRET,
        options
    )
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET) as { sub: string }
}
