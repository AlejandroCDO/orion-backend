import mongoose, { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['client', 'admin'], default: 'client' },
      accessCode: { type: String },
      nombre: { type: String, default: '' },
      apellidos: { type: String, default: '' },
      telefono: { type: String, default: '' },
      favs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', default: [] }],
      watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', default: [] }],
  },
  { versionKey: false, timestamps: true },
);