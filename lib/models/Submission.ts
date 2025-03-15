import mongoose, { Schema, Document } from 'mongoose';
import { IAssignment } from './Assignment';
import { IUser } from './User';

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId | IAssignment;
  student: mongoose.Types.ObjectId | IUser;
  content: string;
  submittedAt: Date;
  grade: number;
  aiGrade: number;
  feedback: string;
  aiFeedback: string;
  status: 'submitted' | 'graded' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema: Schema = new Schema(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    aiGrade: { type: Number },
    feedback: { type: String },
    aiFeedback: { type: String },
    status: { 
      type: String, 
      enum: ['submitted', 'graded', 'returned'], 
      default: 'submitted' 
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a student can only submit once per assignment
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema); 