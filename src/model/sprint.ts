import mongoose, { Document, Schema } from 'mongoose';
import { Helper } from '../helper';


export interface ISprint extends Document {
  title: string;
  startDate: Date,
  endDate: Date,
  isClosed: boolean,
  isCurrent: boolean
}

const sprintSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: false },
    level: { type: Date, required: false, unique: false },
    status: { type: Date, required: false, unique: false },
    isClosed: { type: Boolean, required: false, unique: false },
    isCurrent: { type: Boolean, required: false, unique: false },
  },
  { collection: Helper.SPRINT_COLLECTION_NAME },
);

export const SprintEntity = mongoose.model<ISprint>('Ticket', sprintSchema);