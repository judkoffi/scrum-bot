import { Message, MessageEmbed, Client } from 'discord.js';
import { Database } from '../database';
import { getRandomColor, Helper } from '../helper';
import { ITicket, LEVEL, STATUS } from '../model/ticket';

export function messageHandler(message: Message, db: Database): void {
  const args = message.content.slice(Helper.PREFIX.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (message.author.bot || !message.content.startsWith(Helper.PREFIX)) {
    return;
  }

  switch (command) {
    case 'board': {
      displayBoard(db, message);
      break;
    }

    case 'new': {
      createTicket(db, message, args);
      break;
    }

    case 'info': {
      getTicketDetails(db, message, args);
      break;
    }

    case 'remove': {
      removeTicket(db, message, args);
      break;
    }

    case 'status': {
      updateTicketStatus(db, message, args);
      break;
    }

    default: {
      replySupportedCommand(message);
      break;
    }
  }
}

function _format(detailled: boolean, elt?: ITicket): any {
  if (!elt) return 'No result found';

  if (!detailled) return `[#${elt._id}]:\t ${elt.title}\t => ${elt.assignedTo}`;

  const status = STATUS[elt.status];
  const level = LEVEL[elt.level];
  const msg = new MessageEmbed()
    .setColor(getRandomColor())
    .setThumbnail('https://www.pokepedia.fr/images/9/98/Milobellus-RS.png')
    .setTitle(elt.title)
    .addFields(
      { name: 'id', value: elt._id },
      { name: 'assignedTo', value: elt.assignedTo },
      { name: 'status', value: status },
      { name: 'level', value: level },
    )
    .setTimestamp();
  return msg;
}

function displayBoard(db: Database, message: Message): void {
  db.findAll((values: ITicket[]) => {
    let result = values
      .map((elt) => _format(false, elt))
      .reduce((acc: string, pilot: string) => acc.concat('\n').concat(pilot), '');
    result = result.length === 0 ? '```Nothing found !```' : result;
    return message.reply(result);
  });
}

function replySupportedCommand(message: Message): void {
  const msg = new MessageEmbed()
    .setColor(getRandomColor())
    .attachFiles(['assets/agile.png'])
    .setThumbnail('attachment://agile.png')
    .setTitle('Commands')
    .addFields(
      { name: '!board', value: 'Get all tickets' },
      { name: '!info {id}', value: 'Get info about one ticket' },
      { name: '!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE} ', value: 'Change ticket status' },
      { name: '!new {title} {TODO, INPROGRESS, TOBEVALIDATED, DONE}', value: 'Add a new ticket' },
      { name: '!remove {id}', value: 'Remove a ticket' },
      { name: '!sprint new {name}', value: 'lorem ipsum' },
      { name: '!sprint start', value: 'lorem ipsum' },
      { name: '!sprint stop ', value: 'lorem ipsum' },
    )
    .setTimestamp();
  message.reply(msg);
}

function createTicket(db: Database, message: Message, args: string[]): void {
  if (args.length !== 5) {
    const usage = '!new {title} {LOW|MEDIUM|HIGH} {TODO|PROGRESS|DONE} {assignedTo}';
    message.reply(buildUsageMsg(usage));
    return;
  }

  const level: LEVEL = (LEVEL as any)[args[2]] || LEVEL.MEDIUM;
  const status: STATUS = (STATUS as any)[args[3]] || STATUS.TODO;

  const elt = {
    title: args[1],
    level: level,
    status: status,
    assignedTo: args[4],
  };

  db.insert(elt, (result?: ITicket) => message.reply(result));
}

function getTicketDetails(db: Database, message: Message, args: string[]): void {
  if (args.length !== 2) {
    const usage = '!info {id}';
    message.reply(buildUsageMsg(usage));
    return;
  }
  const id = args[1];
  db.findById(id, (elt?: ITicket) => message.reply(_format(true, elt)));
}

function removeTicket(db: Database, message: Message, args: string[]): void {
  if (args.length !== 2) {
    const usage = '!remove {id}';
    message.reply(buildUsageMsg(usage));
    return;
  }
  const id = args[1];
  db.deleteById(id, () => message.reply('succeded remove of ticket'));
}

function updateTicketStatus(db: Database, message: Message, args: string[]): void {
  if (args.length !== 3) {
    const usage = '!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE}';
    message.reply(buildUsageMsg(usage));
    return;
  }

  const id = args[1];
  const newStatus: STATUS = (STATUS as any)[args[2]];
  db.updateStatus(id, newStatus, (elt?: ITicket) => message.reply(_format(true, elt)));
}

function buildUsageMsg(content: string): MessageEmbed {
  return new MessageEmbed().setColor(getRandomColor()).setTitle('Usage').setDescription(content);
}
