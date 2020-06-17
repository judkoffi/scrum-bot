import { connect } from 'mongoose';
import { ITicket, TicketCollection, ITicketDocument } from './model/ticket';

interface IDatabase {
  findAll(): Promise<ITicketDocument[]>;
  findById(id: string): Promise<ITicketDocument | null>;
  insert(elt: ITicket[]): Promise<ITicketDocument[]>;
  deleteById(id: string): Promise<void>;
}

export class Database implements IDatabase {
  static async of(uri?: string): Promise<Database> {
    if (!uri) {
      throw new Error('Invalid string passed into `Database.of()`. Expected a valid URL.');
    }

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

  async deleteById(id: string): Promise<void> {
    await TicketCollection.deleteOne({ _id: id });
  }
}
