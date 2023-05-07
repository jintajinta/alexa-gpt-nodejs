const { Configuration, OpenAIApi } = require("openai");
const Alexa = require('ask-sdk-core');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = '開発キットの天気ボットにようこそ。天気のことは私に聞いてください。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('開発キットの天気ボットにようこそ。天気のことは私に聞いてください。', speechText)
            .getResponse();
    }
};

const AskWeatherIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskWeatherIntent';
    },
    handle(handlerInput) {
        const speechText = '今日の天気は晴れです。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('今日の天気は晴れです。', speechText)
            .getResponse();
    }
};

const EchoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EchoIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.requestEnvelope.request.intent.slots.TextSlot.value;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('真似っこ', speechText)
            .getResponse();
    }
};

const ChatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatIntent';
    },
    async handle(handlerInput) {
        const prompt = handlerInput.requestEnvelope.request.intent.slots.TextSlot.value;
        const speechText = prompt
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        })
        console.log(completion)
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('AIの返答', speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = '天気のことは私に聞いてください。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('天気のことは私に聞いてください。', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'さようなら。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('さようなら。', speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // クリーンアップロジックをここに追加します。
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`処理されたエラー： ${error.message}`);

        return handlerInput.responseBuilder
            .speak('すみません。コマンドを理解できませんでした。もう一度言ってください。')
            .reprompt('すみません。コマンドを理解できませんでした。もう一度言ってください。')
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskWeatherIntentHandler,
        EchoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        ChatIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();