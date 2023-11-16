import { Request, Response } from 'express';
import Ocorrencia from '../model/Ocorrencia';
import { Types } from 'mongoose';

export async function create(req: Request, res: Response) {
    new Ocorrencia({
        _id: new Types.ObjectId(req.body._id),
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
        res.status(201).send('saved')
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
}


export async function deleta(req: Request, res: Response) {
    const ocorrenciaId = req.params.id;
    try {
        const query = Ocorrencia.findById(ocorrenciaId).lean()
        const deletedCount = (await Ocorrencia.deleteOne(query)).deletedCount
        if (deletedCount) {
            res.send({
                message: `Ocorrencia com Id: ${ocorrenciaId} deletado com sucesso`
            })
        } else {
            res.status(400).send({
                message: `Ocorrencia com Id ${ocorrenciaId} nao encontrado`
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Erro ao tentar deletar ocorrencia" })
    }

}

export async function list(req: Request, res: Response) {
    const ocorrencias = await Ocorrencia.find({})
    res.send(ocorrencias)
}

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { titulo, tipo, data } = req.body

    const updatedDoc = {
        titulo,
        tipo,
        data,
        updatedAt: new Date()
    }

    try {
        const docAntes = await Ocorrencia.findById(id)

        if (docAntes) {
            // se o campo a atualizar nao estiver preenchido,
            // mantem os valores antigos
            if (updatedDoc.titulo === '') {
                updatedDoc.titulo = docAntes.titulo
            }
            if (updatedDoc.tipo === '') {
                updatedDoc.tipo = docAntes.tipo
            }
            if (updatedDoc.data === '') {
                updatedDoc.data = docAntes.data
            }
            const docNovo = await Ocorrencia.findByIdAndUpdate(id, updatedDoc,
                { returnDocument: 'after' })
            return res.status(200).json({ docNovo, docAntes })
        } else {
            return res.status(400).send({
                message: `Ocorrencia com Id ${id} nao encontrado`
            })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Erro ao tentar atualizar ocorrencia" })
    }
}