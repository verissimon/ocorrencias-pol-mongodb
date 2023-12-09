import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URL = process.env.MONGO_URL as string
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string
export const REDIS_HOST = process.env.REDIS_HOST as string
export const REDIS_PORT = Number(process.env.REDIS_PORT)
export const API_PORT = 3000