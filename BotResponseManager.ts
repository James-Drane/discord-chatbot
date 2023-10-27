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
        const isTagged = msg.mentions.has(this.user) && !msg.mentions.everyone;
        const directMention = content.includes(this.botName) || isTagged
        const validResponses = this.responses.filter(br => br.getResponse(msg, directMention));
        
        if (validResponses.length) {
            const randomResponseIndex = Math.floor(Math.random() * validResponses.length);
            const chosenResponse = validResponses[randomResponseIndex];
            const response = chosenResponse.getResponse(msg, directMention);
            chosenResponse.setCooldown();
            return response;
        }
    }
}