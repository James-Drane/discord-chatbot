import { expect } from 'chai';
import sinon from 'sinon';
import Discord from 'discord.js';
import { BotResponseManager } from '../BotResponseManager'

describe('BotResponseManager', () => {
    let botResponseManager: BotResponseManager;
    let fakeMessage;
    let fakeBotResponse;
    let fakeClientUser: Discord.ClientUser;

    beforeEach(() => {
        fakeMessage = {
            content: '',
            mentions: {
                everyone: false,
                has: sinon.stub().returns(false)
            }
        } as any;
        fakeBotResponse = {
            getResponse: sinon.stub().returns('fake response'),
            setCooldown: sinon.stub()
        } as any;
        fakeClientUser = {} as any;

        botResponseManager = new BotResponseManager('bobby b', fakeClientUser, [fakeBotResponse]);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return a valid response if one is available', () => {
        fakeMessage.content = 'some trigger content';
        const response = botResponseManager.getResponse(fakeMessage);
        expect(response).to.equal('fake response');
    });

    it('should return undefined if no valid responses are available', () => {
        fakeBotResponse.getResponse.returns(null);
        fakeMessage.content = 'some unrelated content';
        const response = botResponseManager.getResponse(fakeMessage);
        expect(response).to.be.undefined;
    });

    it('should return a valid response for direct mentions', () => {
        fakeMessage.content = 'hey @bobby b, respond to this';
        fakeMessage.mentions.has.withArgs(fakeClientUser).returns(true);
        const response = botResponseManager.getResponse(fakeMessage);
        expect(response).to.equal('fake response');
    });

    it('should return a valid response for bot name mentions', () => {
        fakeMessage.content = 'hey bobby b, respond to this';
        const response = botResponseManager.getResponse(fakeMessage);
        expect(response).to.equal('fake response');
    });

    it('should set a cooldown for the chosen response', () => {
        fakeMessage.content = 'some trigger content';
        botResponseManager.getResponse(fakeMessage);
        expect(fakeBotResponse.setCooldown.calledOnce).to.be.true;
    });

    it('should not respond to generic mentions like @here', () => {
        fakeMessage.content = 'hey @here, respond to this';
        fakeMessage.mentions.has.withArgs(fakeClientUser).returns(true);
        fakeMessage.mentions.everyone = true; // Simulating that it's not a direct mention of the bot
        botResponseManager.getResponse(fakeMessage);
        expect(fakeBotResponse.getResponse.calledWithExactly(fakeMessage, false)).to.be.true; // Expecting no response as it's not a direct mention
    });
});
