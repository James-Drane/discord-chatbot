import Discord from 'discord.js';
import dotenv from 'dotenv';
import { BotResponseManager } from './BotResponseManager';
import setUpBotResponses from "./setUpBotResponses";
import { BotResponse } from './BotResponse';

let botResponseManager: BotResponseManager;

const clientOptions: Discord.ClientOptions = {
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ]
};
const client = new Discord.Client(clientOptions);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const responses: BotResponse[] = setUpBotResponses();
    botResponseManager = new BotResponseManager("bobby b", client.user, responses);
});

client.on('messageCreate', msg => {
    // console.log("On message triggered.");
    if (msg.author.username == client.user.username) return;
    const response = botResponseManager.getResponse(msg);
    if (response) msg.reply(response);
});

dotenv.config();
client.login(process.env.DISCORD_TOKEN);