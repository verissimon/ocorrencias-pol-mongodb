import { model, Schema } from "mongoose"

const ocorrenciaSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    titulo: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      required: true
    },
    data: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now()
    },
    updatedAt: {
      type: Date,
      default: () => Date.now()
    },
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
  }, { _id: false }
)
const Ocorrencia = model('Ocorrencia', ocorrenciaSchema)

export default Ocorrencia