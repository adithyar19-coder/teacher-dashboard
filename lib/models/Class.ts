import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IClass extends Document {
  name: string;
  description: string;
  classCode: string;
  joinLink: string;
  teacher: mongoose.Types.ObjectId | IUser;
  students: mongoose.Types.ObjectId[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    classCode: { type: String, required: true, unique: true },
    joinLink: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema); 