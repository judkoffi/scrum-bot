import { Client, Message, MessageEmbed } from "discord.js";
import { DataBase } from "../database";
import { Helper, getRandomColor } from "../helper";
import { ITicket, LEVEL, STATUS } from "../model/ticket";

function _format(detailled: boolean, elt?: ITicket): any {
  if (elt === undefined || elt === null)
    return 'No result found';

  if (!detailled)
    return `[#${elt._id}]:\t ${elt.title}\t => ${elt.assignedTo}`;

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


export function messageHandler(message: Message, db: DataBase, client: Client) {
  if (message.content.startsWith('!help')) {
    return message.reply(Helper.HELP_MSG);
  }

  if (message.content.startsWith('!stop')) {
    message.member?.voice.channel?.leave();
  }

  if (message.content.startsWith('!all')) {
    db.findAll((values: ITicket[]) => {
      let result = values
        .map((elt) => _format(false, elt))
        .reduce((acc: string, pilot: string) => acc.concat('\n').concat(pilot), '');
      result = result.length === 0 ? '```Nothing found !```' : result;
      return message.reply(result);
    });
  }

  if (message.content.startsWith('!info')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      message.reply(Helper._responseFormat('usage', '```!info {id}```'));
      return;
    }
    const id = args[1];
    db.findById(id, (elt?: ITicket) => message.reply(_format(true, elt)));
  }

  if (message.content.startsWith('!status')) {
    const args = message.content.split(' ');
    if (args.length < 3) {
      message.reply(Helper._responseFormat('usage', '```!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE}```'));
      return;
    }
    const id = args[1];
    const newStatus: STATUS = (STATUS as any)[args[2]];
    db.updateStatus(id, newStatus, (elt?: ITicket) => message.reply(_format(true, elt)));
  }

  if (message.content.startsWith('!remove')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      message.reply(Helper._responseFormat('usage', '```!remove {id}```'));
      return;
    }
    const id = args[1];
    db.deleteById(id, () => message.reply('succeded remove of ticket'));
  }

  if (message.content.startsWith('!new')) {
    const args = message.content.split(' ');
    if (args.length < 5) {
      message.reply(Helper._responseFormat('usage', '```!new {title} {LOW|MEDIUM|HIGH} {TODO|PROGRESS|DONE} {assignedTo}```'));
      return;
    }

    const level: LEVEL = (LEVEL as any)[args[2]] || LEVEL.MEDIUM;
    const status: STATUS = (STATUS as any)[args[3]] || STATUS.TODO;

    const params = {
      'title': args[1],
      'level': level,
      'status': status,
      'assignedTo': args[4]
    }

    db.insertAll([params], (result?: ITicket) => message.reply(result));
  }
}