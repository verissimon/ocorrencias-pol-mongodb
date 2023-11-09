import { Request, Response } from 'express';
import Ocorrencia from '../model/Ocorrencia';

export async function create(req: Request, res: Response) {
    new Ocorrencia({
        titulo: req.body.titulo,
        tipo: req.body.tipo,
        data: new Date(req.body.data),
        geom: {
            type: 'Point',
            coordinates: req.body.geom
        }
    }).save()
    .then(() => {
        console.log('Salvo com sucesso!')
        res.status(201).send('saved');
    })
    .catch(err => {
        console.log(err)
        res.status(400).send(err)
    });
}

export async function list(req: Request, res: Response){
    const ocorrencias = await Ocorrencia.find({})
    res.send(ocorrencias)
}