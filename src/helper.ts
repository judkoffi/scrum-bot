import { ColorResolvable, MessageEmbed } from 'discord.js';

export function getRandomColor(): ColorResolvable {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

export class Helper {
  static PREFIX = '!';
  static TICKET_COLLECTION_NAME = 'ticket';
  static SPRINT_COLLECTION_NAME = 'sprint';

  static _responseFormat(title: string, description?: string) {
    return new MessageEmbed()
      .setColor(getRandomColor())
      .setTitle(title)
      .setDescription(description);
  }
}