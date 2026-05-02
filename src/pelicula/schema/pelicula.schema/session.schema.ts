import mongoose, { Schema } from 'mongoose';

export const SessionSchema = new Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pelicula',
      required: true,
    },
    fecha: { type: Date, required: true },
    hora: [{ type: String, required: true }],
    sala: { type: String, required: true },
    precio: {
      adulto: { type: Number, default: 7.0 },
      reducido: { type: Number, default: 6.5 },
      jubilado: { type: Number, default: 5.9 },
    },
    asientos: [[Boolean]],
  },
  { versionKey: false, timestamps: true },
);