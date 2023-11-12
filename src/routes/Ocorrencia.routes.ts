import express from 'express';
import { create, list, deleta } from '../controller/Ocorrencia.controller';

const ocorrenciaRouter = express.Router();

//CREATE
ocorrenciaRouter.post('/', create);

//READ
ocorrenciaRouter.get('/', list);

//DELETE
ocorrenciaRouter.delete('/:id', deleta);

export default ocorrenciaRouter;