import { Message, MessageEmbed } from 'discord.js';
import { Database } from '../database';
import { getRandomColor, Helper } from '../helper';
import { STATUS, Ticket } from '../model/ticket';

export function messageHandler(message: Message, db: Database): void {
  const args = message.content.slice(Helper.PREFIX.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (message.author.bot || !message.content.startsWith(Helper.PREFIX)) {
    return;
  }

  console.log(args);

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

    // case 'remove': {
    //   removeTicket(db, message, args);
    //   break;
    // }

    // case 'status': {
    //   updateTicketStatus(db, message, args);
    //   break;
    // }

    default: {
      replySupportedCommand(message);
      break;
    }
  }
}

function _format(detailled: boolean, elt?: Ticket): any {
  if (!elt) return 'No result found';

  if (!detailled) return `[#${elt.id}]:\t ${elt.title}\t => ${elt.assignedTo}`;

  const status = STATUS[elt.status];
  const msg = new MessageEmbed()
    .setColor(getRandomColor())
    .setThumbnail('https://www.pokepedia.fr/images/9/98/Milobellus-RS.png')
    .setTitle(elt.title)
    .addFields(
      { name: 'id', value: elt.id },
      { name: 'assignedTo', value: elt.assignedTo },
      { name: 'status', value: status },
    )
    .setTimestamp();
  return msg;
}

function displayBoard(db: Database, message: Message): void {
  // db.findAll((values: ITicket[]) => {
  //   let result = values
  //     .map((elt) => _format(false, elt))
  //     .reduce((acc: string, pilot: string) => acc.concat('\n').concat(pilot), '');
  //   result = result.length === 0 ? '```Nothing found !```' : result;
  //   return message.reply(result);
  // });

  db.findAll()
    .then((values) => {
      const r = values
        .map((e) => new Ticket(e._id, e.title, e.status, e.assignedTo))
        .map((e) => e.toString())
        .reduce((acc: string, pilot: string) => acc.concat('\n').concat(pilot), '');
      message.reply(r);
    })
    .catch((error) => console.error(error));
}

function createTicket(db: Database, message: Message, args: string[]): void {
  if (args.length !== 2) {
    const usage = '!new {title} {assignedTo}';
    message.reply(buildUsageMsg(usage));
    return;
  }

  const value = new Ticket('', args[0], STATUS.TODO, args[1]);
  db.insert([value])
    .then((ticket) => message.reply('fdsd'))
    .catch((error) => console.error(error));
}

function getTicketDetails(db: Database, message: Message, args: string[]): void {
  if (args.length !== 1) {
    const usage = '!info {id}';
    message.reply(buildUsageMsg(usage));
    return;
  }
  const id = args[0];
  db.findById(id)
    .then((elt) => {
      if (!elt) return;
      const ticket = new Ticket(elt._id, elt.title, elt.status, elt.assignedTo);
      message.reply(_format(true, ticket));
    })
    .catch((error) => console.error());
}

// function removeTicket(db: Database, message: Message, args: string[]): void {
//   if (args.length !== 2) {
//     const usage = '!remove {id}';
//     message.reply(buildUsageMsg(usage));
//     return;
//   }
//   const id = args[1];
//   db.deleteById(id, () => message.reply('succeded remove of ticket'));
// }

// function updateTicketStatus(db: Database, message: Message, args: string[]): void {
//   if (args.length !== 3) {
//     const usage = '!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE}';
//     message.reply(buildUsageMsg(usage));
//     return;
//   }

//   const id = args[1];
//   const newStatus: STATUS = (STATUS as any)[args[2]];
//   db.updateStatus(id, newStatus, (elt?: ITicket) => message.reply(_format(true, elt)));
// }

function buildUsageMsg(content: string): MessageEmbed {
  return new MessageEmbed().setColor(getRandomColor()).setTitle('Usage').setDescription(content);
}

function replySupportedCommand(message: Message): void {
  message.reply(
    new MessageEmbed()
      .setColor(getRandomColor())
      .attachFiles(['assets/agile.png'])
      .setThumbnail('attachment://agile.png')
      .setTitle('Commands')
      .addFields(Helper.COMMANDS_MAPS)
      .setTimestamp(),
  );
}
