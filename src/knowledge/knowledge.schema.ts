import mongoose from "mongoose";

const colorValidator = (v: string) => new RegExp("^#([0-9a-fA-F]{3}){1,2}$").test(v);

export const KnowledgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
        order: { type: Number, default: 0 },
        color: { type: String, validator: [colorValidator, 'HexCode Invalido!'], default: '#e0e0e0' }
    },
    { timestamps: true, collection: 'knowledges' }
);

export interface Knowledge extends mongoose.Document {
    name: string;
    description: string;
    user: mongoose.Schema.Types.ObjectId;
    subjects?: mongoose.Types.ObjectId[];
    order?: Number;
    color?: string;
}