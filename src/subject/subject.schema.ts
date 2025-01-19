import * as mongoose from 'mongoose';

export const SubjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        shortName: { type: String, maxLength: 10 },
        description: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        journeys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journey' }],
        order: { type: Number, default: 0 }
    },
    { timestamps: true, collection: 'subjects' },
);

export interface Subject extends mongoose.Document {
    name: string;
    shortName: string;
    description: string;
    user: mongoose.Schema.Types.ObjectId;
    journeys?: mongoose.Types.ObjectId[];
    order?: Number;
}