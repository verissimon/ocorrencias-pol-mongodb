import { Request, Response } from 'express';
import Ocorrencia from '../model/Ocorrencia';
import mongoose from 'mongoose';

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

export async function deleta(req:Request, res: Response){
    const ocorrenciaId = req.params.id;

    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(ocorrenciaId);
        if (!isValidObjectId) {
            return res.status(400).json({ message: 'ID de ocorrência inválido' });
        }

        const deletedOcorrencia = await Ocorrencia.findByIdAndDelete(ocorrenciaId);

        if (!deletedOcorrencia) {
            return res.status(404).json({ message: 'Ocorrência não encontrada ou já foi deletada' });
        }

        res.status(200).json({ message: 'Ocorrência deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error});
    }

}

export async function list(req: Request, res: Response){
    const ocorrencias = await Ocorrencia.find({})
    res.send(ocorrencias)
}