import { ColorResolvable, MessageEmbed } from 'discord.js';
import { LFService } from 'typescript-logging';

export function getRandomColor(): ColorResolvable {
  return Math.floor(Math.random() * 16777215).toString(16);
}

export class Helper {
  static HELP_MSG = new MessageEmbed()
    .setColor(getRandomColor())
    .setThumbnail('https://www.pokepedia.fr/images/9/98/Milobellus-RS.png')
    .setTitle('Commands')
    .addFields(
      { name: '!all', value: 'Get all tickets' },
      { name: '!info {id}', value: 'Get info about one ticket' },
      { name: '!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE} ', value: 'Change ticket status' },
      { name: '!new {title} {LOW|MEDIUM|HIGH} {TODO|PROGRESS|DONE}', value: 'Add a new ticket' },
      { name: '!remove {id}', value: 'Remove a ticket' }
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



export class Logger {
  static LoggerFactory = LFService.createNamedLoggerFactory('scrum-bot');
}
