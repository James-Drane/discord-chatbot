import Discord from 'discord.js';

type ResponseFunction = (msg: Discord.Message<boolean>, directMention: boolean) => string;

const DEFAULT_COOLDOWN = 10 * 60;

export class BotResponse {
    private isOnCooldown: boolean;
    private cooldownSeconds: number;
    public responseLogic: ResponseFunction

    constructor(responseLogic: ResponseFunction, cooldownSeconds = DEFAULT_COOLDOWN) {
        this.responseLogic = responseLogic;
        this.cooldownSeconds = cooldownSeconds;
        this.isOnCooldown = false;
    }

    getResponse = (msg: Discord.Message<boolean>, directMention = false) => {
        if (!this.isOnCooldown || directMention) {
            return this.responseLogic(msg, directMention);
        }
    }

    setCooldown() {
        if (this.isOnCooldown) return;
        this.isOnCooldown = true;
        setTimeout(() => { this.isOnCooldown = false; }, this.cooldownSeconds * 1000);
    }

    static checkMessageForTriggerPhrases(msg: Discord.Message<boolean>, triggerPhrases: string[]): boolean {
        const message = msg.content.toLowerCase();
        return triggerPhrases.filter(tp => message.includes(tp)).length > 0;
    }

    static getStandardResponseLogic(triggerPhrases: string[], response: (msg: Discord.Message<boolean>) => string): ResponseFunction {
        return (msg, directMention) => {
            const containsTriggerPhrase = BotResponse.checkMessageForTriggerPhrases(msg, triggerPhrases);
            if (directMention || containsTriggerPhrase) {
                return response(msg);
            }
        }
    }
}