import { ColorResolvable, MessageEmbed } from 'discord.js';
import { LFService } from 'typescript-logging';

export function getRandomColor(): ColorResolvable {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

export class Helper {
  static HELP_MSG = new MessageEmbed()
    .setColor(getRandomColor())
    .setThumbnail('https://www.pokepedia.fr/images/9/98/Milobellus-RS.png')
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

  static DATABASENAME = 'scrum-bot';
  static COLLECTION = 'ticket';

  static _responseFormat(title: string, description?: string) {
    return new MessageEmbed()
      .setColor(getRandomColor())
      .setTitle(title)
      .setDescription(description);
  }
}