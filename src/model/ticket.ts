import mongoose, { Document, Schema } from 'mongoose';
import { Helper } from '../helper';

export enum STATUS {
  TODO,
  INPROGRESS,
  TOBEVALIDATED,
  DONE,
}

export interface ITicket {
  title: string;
  status: STATUS;
  assignedTo: string;
}

export class Ticket implements ITicket {
  public id = '';
  public title: string;
  public status: STATUS;
  public assignedTo: string;

  constructor(id: string, title: string, status: STATUS, assignedTo: string) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.assignedTo = assignedTo;
  }
}

export interface ITicketDocument extends ITicket, Document {
  title: string;
  status: STATUS;
  assignedTo: string;
}

const ticketSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: false },
    status: { type: STATUS, required: true, unique: false },
    assignedTo: { type: String, required: true, unique: false },
  },
  { collection: Helper.TICKET_COLLECTION_NAME },
);

export const TicketCollection = mongoose.model<ITicketDocument>('Ticket', ticketSchema);
