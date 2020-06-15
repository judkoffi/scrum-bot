import { Client } from 'discord.js';
import { config } from 'dotenv';
import { Database } from './database';
import { messageHandler } from './events/message';
import { readyHandler } from './events/ready';

config();
const client = new Client();

Database.of(process.env.DB_URI)
  .then((db) => {
    console.log('connection db good');
    client.on('ready', () => readyHandler(client));
    client.on('message', (message) => messageHandler(message, db));
    client.login(process.env.BOT_TOKEN);
  })
  .catch((error) => {
    client.destroy();
    console.error(error);
    process.exit();
  });
