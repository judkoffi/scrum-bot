import { Message, MessageEmbed } from 'discord.js';
import { Database } from '../database';
import { getRandomColor, Helper } from '../helper';
import { STATUS, Ticket, ITicketDocument } from '../model/ticket';

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

    case 'remove': {
      removeTicket(db, message, args);
      break;
    }

    case 'status': {
      updateTicketStatus(db, message, args);
      break;
    }

    default: {
      message.reply(
        new MessageEmbed()
          .setColor(getRandomColor())
          .attachFiles(['assets/agile.png'])
          .setThumbnail('attachment://agile.png')
          .setTitle('Commands')
          .addFields(Helper.COMMANDS_MAPS)
          .setTimestamp(),
      );
      break;
    }
  }
}

function displayBoard(db: Database, message: Message): void {
  db.findAll()
    .then((values) => {
      if (values.length === 0) {
        message.reply('Nothing to display !');
        return;
      }

      const msg = new MessageEmbed()
        .setColor(getRandomColor())
        .attachFiles(['assets/agile.png'])
        .setThumbnail('attachment://agile.png')
        .setTitle('Board')
        .setTimestamp();

      values.forEach((elt) => msg.addField(elt._id, elt.title));
      message.reply(msg);
    })
    .catch((error) => {
      const errorMsg = `An error occured:  ${error}`;
      message.reply(errorMsg);
    });
}

function createTicket(db: Database, message: Message, args: string[]): void {
  if (args.length !== 2) {
    const usage = `${Helper.PREFIX}new {title} {assignedTo}`;
    message.reply(buildUsageMsg(usage));
    return;
  }

  const value = new Ticket('', args[0], STATUS[0], args[1]);
  db.insert([value])
    .then((ticket) => {
      const msg = `${ticket[0].title} succeded created`;
      message.reply(msg);
    })
    .catch((error) => {
      const errorMsg = `An error occured:  ${error}`;
      message.reply(errorMsg);
    });
}

function getTicketDetails(db: Database, message: Message, args: string[]): void {
  if (args.length !== 1) {
    const usage = `${Helper.PREFIX}info {id}`;
    message.reply(buildUsageMsg(usage));
    return;
  }

  const id = args[0];
  db.findById(id)
    .then((elt) => {
      if (!elt) {
        return;
      }
      const msg = buildInfoMessage(elt);
      message.reply(msg);
    })
    .catch((error) => {
      const errorMsg = `An error occured:  ${error}`;
      message.reply(errorMsg);
    });
}

function removeTicket(db: Database, message: Message, args: string[]): void {
  if (args.length !== 1) {
    const usage = `${Helper.PREFIX}remove {id}`;
    message.reply(buildUsageMsg(usage));
    return;
  }
  const id = args[1];
  db.deleteById(id)
    .then(() => message.reply('succeded remove of ticket'))
    .catch((error) => {
      const errorMsg = `An error occured:  ${error}`;
      message.reply(errorMsg);
    });
}

function updateTicketStatus(db: Database, message: Message, args: string[]): void {
  if (args.length !== 2) {
    const usage = `${Helper.PREFIX}status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE}`;
    message.reply(buildUsageMsg(usage));
    return;
  }

  const id = args[0];
  const newStatus = args[1];
  if (!STATUS.includes(newStatus)) {
    message.reply(buildErrorMsg(`Unknow status value: ${newStatus}`));
    return;
  }

  db.updateStatus(id, newStatus)
    .then((elt) => {
      if (!elt) return;
      message.reply(buildInfoMessage(elt));
    })
    .catch((error) => {
      const errorMsg = `An error occured:  ${error}`;
      message.reply(errorMsg);
    });
}

function buildUsageMsg(content: string): MessageEmbed {
  return new MessageEmbed().setColor(getRandomColor()).setTitle('Usage').setDescription(content);
}

function buildErrorMsg(content: string): MessageEmbed {
  return new MessageEmbed().setColor(getRandomColor()).setTitle('Error').setDescription(content);
}

function buildInfoMessage(elt: ITicketDocument) {
  return new MessageEmbed()
    .setColor(getRandomColor())
    .attachFiles(['assets/agile.png'])
    .setThumbnail('attachment://agile.png')
    .setTitle(elt.title)
    .setTimestamp()
    .addFields(
      { name: 'id', value: elt._id },
      { name: 'assignedTo', value: elt.assignedTo },
      { name: 'status', value: elt.status },
    );
}
