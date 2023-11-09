import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URL = process.env.MONGO_URL as string
export const API_PORT = process.env.API_PORT as string