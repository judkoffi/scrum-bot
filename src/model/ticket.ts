import mongoose, { Document, Schema } from 'mongoose';
import { Helper } from '../helper';

export enum LEVEL {
	LOW, MEDIUM, HIGH
}

export enum STATUS {
	TODO, INPROGRESS, TOBEVALIDATED, DONE
}

export interface ITicket extends Document {
	title: string;
	level: LEVEL;
	status: STATUS;
	assignedTo: string;
}

const ticketSchema: Schema = new Schema(
	{
		title: { type: String, required: true, unique: false },
		level: { type: LEVEL, required: true, unique: false },
		status: { type: STATUS, required: true, unique: false },
		assignedTo: { type: String, required: true, unique: false },
	},
	{ collection: Helper.TICKET_COLLECTION_NAME},
);

export const TicketEntity = mongoose.model<ITicket>('Ticket', ticketSchema);