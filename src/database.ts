import { getLogger } from 'log4js';
import { connect, DocumentQuery } from 'mongoose';
import { ITicket, STATUS, TicketCollection, ITicketDocument } from './model/ticket';
const ID_REGEX = /^[0-9a-fA-F]{24}$/;

const logger = getLogger();

interface IDatabase {
  findAll(): Promise<ITicketDocument[]>;
  findById(id: string): Promise<ITicketDocument | null>;
  insert(elt: ITicket[]): Promise<ITicketDocument[]>;
  //delete(id: string): Promise<ITicketDocument>;
}

export class Database implements IDatabase {
  static async of(uri?: string): Promise<Database> {
    if (!uri) throw new Error('Invalid string passed into `Database.of()`. Expected a valid URL.');

    const client = connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    (await client).connection;
    return new Database();
  }

  async findAll(): Promise<ITicketDocument[]> {
    return await TicketCollection.find();
  }

  async findById(id: string): Promise<ITicketDocument | null> {
    return TicketCollection.findById(id);
  }

  insert(elts: ITicket[]): Promise<ITicketDocument[]> {
    return TicketCollection.insertMany(elts);
  }
}
