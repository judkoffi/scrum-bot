import { getLogger } from 'log4js';
import mongoose from 'mongoose';
import { ITicket, STATUS, TicketEntity } from './model/ticket';
const ID_REGEX = /^[0-9a-fA-F]{24}$/;

const logger = getLogger();

export class Database {
  static async of(uri?: string): Promise<Database> {
    if (!uri) throw new Error('Invalid string passed into `Database.of()`. Expected a valid URL.');

    const client = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    (await client).connection;
    return new Database();
  }

  async findAll(callback: CallableFunction): Promise<void> {
    TicketEntity.find({}, (error: Error, values: ITicket[]) => {
      if (error) {
        logger.error(error.message, error);
        return;
      }
      callback(values);
    });
  }

  async findById(id: string, callback: CallableFunction): Promise<void> {
    if (!id.match(ID_REGEX)) return;

    TicketEntity.findById(id, (error: Error, value: ITicket) => {
      if (error) {
        logger.error(error.message, error);
        return;
      }
      callback(value);
    });
  }

  async deleteById(id: string, callback: CallableFunction): Promise<void> {
    TicketEntity.deleteOne({ _id: id }, (error: Error) => {
      if (error) {
        logger.error(error.message, error);
        return;
      }
      callback();
    });
  }

  async insert(elt: any, callback: CallableFunction): Promise<void> {
    TicketEntity.insertMany([elt], (error: Error, value: ITicket) => {
      if (error) {
        logger.error(error.message, error);
        return;
      }

      const result = `succeded insert of ${value.title}`;
      callback(result);
    });
  }

  updateStatus(id: string, newStatus: STATUS, callback: CallableFunction): void {
    if (!id.match(ID_REGEX)) return;
    TicketEntity.findById(id, (error: Error, value: ITicket) => {
      if (error) {
        logger.error(error.message, error);
        return;
      }

      if (newStatus === null || newStatus === undefined) {
        callback(value);
        return;
      }

      value.status = newStatus;
      value.save();
      callback(value);
    });
  }
}
