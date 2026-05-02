import mongoose, { Schema } from 'mongoose';

export const ValoracionSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    peliculaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

// Un usuario solo puede valorar una película una vez
ValoracionSchema.index({ userId: 1, peliculaId: 1 }, { unique: true });