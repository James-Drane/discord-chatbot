import Discord from 'discord.js';
import { BotResponse } from "./BotResponse";

export class BotResponseManager {
    private botName: string;
    private responses: BotResponse[];
    private user: Discord.ClientUser;

    constructor(botName: string, clientUser: Discord.ClientUser, responses: BotResponse[]) {
        this.botName = botName
        this.responses = responses
        this.user = clientUser;
    }

    public getResponse(msg: Discord.Message<boolean>): string {
        const content = msg.content.toLowerCase();
        const directMention = content.includes(this.botName) || msg.mentions.has(this.user);
        const validResponses = this.responses.filter(br => br.getResponse(msg, directMention));
        
        if (validResponses.length || directMention) {
            const randomResponseIndex = Math.floor(Math.random() * validResponses.length);
            const chosenResponse = validResponses[randomResponseIndex];
            const response = chosenResponse.getResponse(msg, directMention);
            chosenResponse.setCooldown();
            return response;
        }
    }
}