import mongoose, { Document, Schema } from 'mongoose';
import { Helper } from '../helper';

export const STATUS: Array<string> = ['TODO', 'INPROGRESS', 'TOBEVALIDATED', ' DONE'];

export interface ITicket {
  title: string;
  status: string;
  assignedTo: string;
}

export class Ticket implements ITicket {
  public id = '';
  public title: string;
  public status: string;
  public assignedTo: string;

  constructor(id: string, title: string, status: string, assignedTo: string) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.assignedTo = assignedTo;
  }
}

export interface ITicketDocument extends ITicket, Document {
  title: string;
  status: string;
  assignedTo: string;
}

const ticketSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: false },
    status: {
      type: String,
      required: true,
      unique: false,
      enum: STATUS,
    },
    assignedTo: { type: String, required: true, unique: false },
  },
  { collection: Helper.TICKET_COLLECTION_NAME },
);

export const TicketCollection = mongoose.model<ITicketDocument>('Ticket', ticketSchema);
