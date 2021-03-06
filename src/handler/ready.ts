import { Client } from 'discord.js';
import { Helper } from '../helper';

export async function readyHandler(client: Client): Promise<void> {
  console.log(`Logged in as ${client.user?.tag}!`);
  await client?.user?.setPresence({
    status: 'online',
    activity: { name: `${Helper.PREFIX}help` },
  });
}
