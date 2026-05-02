import mongoose, { Schema } from 'mongoose';

export const PeliculaSchema = new Schema({
    titulo: { type: String, required: true, index: true },
    sinopsis: { type: String, required: true },
    genres: [{ type: String, required: true }],
    director: { type: String, required: true },
    year: {
      type: Number,
      default: new Date().getFullYear(),
      min: 1800,
      max: new Date().getFullYear()
    },
    posterURL: { type: String, required: true },
    duracion: { type: String, required: true },
    clasEdad: {
      type: String,
      required: true,
      enum: ['+0', '+7', '+12', '+16', '+18']
    },
    mediaValoracion: { type: Number, default: 0 },
    totalValoraciones: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true },
);