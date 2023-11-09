import mongoose from "mongoose";
import { MONGO_URL } from "./config";

export async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Conectado com o Mongo');
    } catch (error) {
        console.log(error)
    }
}

