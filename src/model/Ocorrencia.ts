import {model, Schema} from "mongoose"

const Ocorrencia = model('Ocorrencia',
    new Schema({
        titulo: String,
        tipo: String,
        data: Date,
        geom: {
            type: {
              type: String,
              enum: ['Point'],
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
        }
    })
)

export default Ocorrencia