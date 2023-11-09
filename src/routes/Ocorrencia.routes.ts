import express from 'express';
import { create, list } from '../controller/Ocorrencia.controller';

const ocorrenciaRouter = express.Router();

//CREATE
ocorrenciaRouter.post('/', create);

//READ
ocorrenciaRouter.get('/', list);

export default ocorrenciaRouter;