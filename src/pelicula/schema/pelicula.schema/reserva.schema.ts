import mongoose, { Schema } from 'mongoose';

export const ReservaSchema = new Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sesionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    entradas: {
      adulto: { type: Number, default: 0 },
      reducido: { type: Number, default: 0 },
      jubilado: { type: Number, default: 0 },
    },
    asientosSeleccionados: [String],
    totalPagado: { type: Number, required: true },
    fechaReserva: { type: Date, default: Date.now },
    horaElegida: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);