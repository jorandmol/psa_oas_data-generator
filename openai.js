import { Configuration, OpenAIApi } from "openai";
import examples from './utils/examples.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const Prompts = {
    INIT: 'You are an expert in the API REST field and you are going to receive an OpenAPI specification which belongs to an API REST. Your task is to make some operations regarding the resources specified in the specification. Your responses must follow user\'s instructions and must be JSON, not normal text',
    EXTRACT: 'Extract the main entities used in the service from the specification inserted between **. Those entities could be easily found inside request bodies and request responses. The response must be a JSON array which contains an object for each of the entities. For each of the objects contained in the array you must add the name of the entity, the description and the attributes. The last one is an array of objects which has the name of the attribute and the type (string, integer, boolean, etc.).',
    GENERATE: 'Having extracted the main entities, return a random list of JSON objects for the entity indicated between **. The values stored in their properties must be real and must consider the type'
};

const Roles = {
    SYSTEM: 'system',
    USER: 'user',
    ASSITANT: 'assistant'
}

let context = [
    { role: Roles.SYSTEM, content: Prompts.INIT },
    { role: Roles.USER, content: `${Prompts.EXTRACT} **${examples.oas}**` },
    { role: Roles.ASSITANT, content: examples.resources },
    { role: Roles.USER, content: `${Prompts.GENERATE} **pet**` },
    { role: Roles.ASSITANT, content: examples.data }
];

const getChatCompletion = async (messages) => {
    return openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages
    });
}

export const extractResources = async (apiSpec) => {
    context = [
        ...context,
        { role: Roles.USER, content: `${Prompts.EXTRACT} **${apiSpec}**`}
    ];

    const completion = await getChatCompletion(context);
    const { message } = completion.data.choices[0];

    context = [ ...context, message ];
    return message.content;
};

export const generateData = async (resource) => {
    context = [
        ...context,
        { role: Roles.USER, content: `${Prompts.GENERATE} **${resource}**` }
    ];

    const completion = await getChatCompletion(context);
    const { message } = completion.data.choices[0];

    context = [ ...context, message ];
    return message.content;
};