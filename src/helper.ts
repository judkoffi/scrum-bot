import { ColorResolvable, MessageEmbed, EmbedFieldData } from 'discord.js';

export function getRandomColor(): ColorResolvable {
  return Math.floor(Math.random() * 16777215).toString(16);
}

export class Helper {
  static PREFIX = '!';
  static TICKET_COLLECTION_NAME = 'ticket';
  static COMMANDS_MAPS: EmbedFieldData[] = [
    { name: '!board', value: 'Get all tickets' },
    { name: '!info {id}', value: 'Get info about one ticket' },
    { name: '!status {id} {TODO, INPROGRESS, TOBEVALIDATED, DONE} ', value: 'Change ticket status' },
    { name: '!new {title} {assignedTo}', value: 'Create a new ticket' },
    { name: '!remove {id}', value: 'Remove a ticket' },
  ];

  static _responseFormat(title: string, description?: string): MessageEmbed {
    return new MessageEmbed().setColor(getRandomColor()).setTitle(title).setDescription(description);
  }
}
