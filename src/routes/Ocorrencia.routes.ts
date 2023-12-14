import express from 'express';
import { create, list, deleta, update, findById, geoFilter } from '../controller/Ocorrencia.controller';

const ocorrenciaRouter = express.Router();

//CREATE
ocorrenciaRouter.post('/', create);

//READ
ocorrenciaRouter.get('/', list);
ocorrenciaRouter.get('/filter', geoFilter)
ocorrenciaRouter.get('/:id', findById)
//DELETE
ocorrenciaRouter.delete('/:id', deleta);

//UPDATE
ocorrenciaRouter.put('/:id', update)

export default ocorrenciaRouter;