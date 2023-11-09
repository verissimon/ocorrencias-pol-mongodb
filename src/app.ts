import express from "express";
import cors from 'cors'
import { main as init_mongoose } from "./database/mongoose";
import { API_PORT } from "./database/config";
import ocorrenciaRouter from './routes/Ocorrencia.routes'

const app = express()
app.use(express.json())
app.use(cors())
init_mongoose()

app.use('/ocorrencias', ocorrenciaRouter);

app.listen(API_PORT, ()=>{
    console.log(`APP RUNNING ON PORT ${API_PORT}.`);
});
