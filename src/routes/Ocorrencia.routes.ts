import express from 'express';
import { create, list, deleta, update,  } from '../controller/Ocorrencia.controller';

const ocorrenciaRouter = express.Router();

//CREATE
ocorrenciaRouter.post('/', create);

//READ
ocorrenciaRouter.get('/', list);

//DELETE
ocorrenciaRouter.delete('/:id', deleta);

//UPDATE
ocorrenciaRouter.put('/:id', update)

export default ocorrenciaRouter;