import * as mongoose from 'mongoose';

export const JourneySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    trails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trail' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'journeys' },
);

export interface Journey extends mongoose.Document {
  title: string;
  description?: string;
  subject: mongoose.Schema.Types.ObjectId;
  trails?: mongoose.Types.ObjectId[];
  order: { type: number; default: 0 };
}
