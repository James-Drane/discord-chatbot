import { expect } from 'chai';
import { BotResponse } from '../BotResponse';

describe('BotResponse', () => {
    let mockMessage: any
    let botResponse: BotResponse

    beforeEach(() => {
        mockMessage = { content: "mock message" };
        const triggerPhrases = ["mock", "phrases"];
        const response = (msg) => `Mock Response`;
        const responseLogic = BotResponse.getStandardResponseLogic(triggerPhrases, response);
        botResponse = new BotResponse(responseLogic, 0.1);
    });

    it('should instantiate from standard response logic', () => {
        expect(botResponse).to.not.be.undefined;
    });

    it('should give a response if a trigger phrase is mentioned', () => {
        const response = botResponse.getResponse(mockMessage);
        expect(response).to.equal("Mock Response");
    });

    it('should give a response if directly mentioned but the trigger phrases are not used', () => {
        mockMessage = { content: "other message" };
        const response = botResponse.getResponse(mockMessage, true);
        expect(response).to.equal("Mock Response");
 
    });

    it('should not give a response if not directly mentioned and the trigger phrases are not used', () => {
        mockMessage = { content: "other message" };
        const response = botResponse.getResponse(mockMessage);
        expect(response).to.be.undefined;
    });

    it('should not give a response if on cooldown', () => {
        botResponse.setCooldown();
        const response = botResponse.getResponse(mockMessage);
        expect(response).to.be.undefined;
    });

    it('should not give a response if words containing the trigger phrases are used', () => {
        // Adjust the triggerPhrases to include "son" for this test
        const triggerPhrases = ["son"];
        const responseFunc = (msg) => `Mock Response`;
        const responseLogic = BotResponse.getStandardResponseLogic(triggerPhrases, responseFunc);
        botResponse = new BotResponse(responseLogic, 0.1);
    
        // Test a message that includes a word containing the trigger phrase
        mockMessage = { content: "person" };
        const response = botResponse.getResponse(mockMessage);
        expect(response).to.be.undefined;
    });
});
