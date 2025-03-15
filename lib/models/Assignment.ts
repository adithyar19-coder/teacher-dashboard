import mongoose, { Schema, Document } from 'mongoose';
import { IClass } from './Class';
import { IUser } from './User';

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  class: mongoose.Types.ObjectId | IClass;
  createdBy: mongoose.Types.ObjectId | IUser;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalPoints: { type: Number, required: true, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema); 