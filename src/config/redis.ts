import { createClient } from 'redis';

export const redis =  createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 18037
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

redis.connect();



