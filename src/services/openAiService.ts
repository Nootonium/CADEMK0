import { Configuration, OpenAIApi } from "openai";
import { OpenAiCompletionParams } from "../types";
import { getEnvVariables } from "../config";
const CONFIG = getEnvVariables();
const configuration = new Configuration({
    apiKey: CONFIG.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface GptPrompt {
    name: string;
    message: string;
}

function buildPrompt({ name, message }: GptPrompt): string {
    return `Based on the following message received via my portfolio contact form, please classify the type of inquiry
        (e.g., job offer, collaboration proposal, question, etc.) and then generate a professional and friendly response (Response) without specifying my availability.
        Try to respond in the same language as the message. The message is: ${message} from ${name}. Please generate a response in the following format:
        {
            "inquiryType": "[type]",
            "response": "[response text]"
        }`;
}

export async function getCompletion(params: OpenAiCompletionParams): Promise<string> {
    const response = await openai.createCompletion({
        ...params,
    });
    if ("choices" in response.data && response.data.choices.length > 0) {
        return response.data?.choices[0]?.text || "";
    }
    return "";
}

export async function getValidatedResponse({ name, message }: GptPrompt) {
    const gptPrompt = buildPrompt({ name, message });
    const params: OpenAiCompletionParams = {
        model: "text-davinci-003",
        prompt: gptPrompt,
        max_tokens: 256,
        frequency_penalty: 0.3,
    };
    const response = await getCompletion(params);

    if (!validateResponse(response)) {
        throw new Error("Invalid response received from OpenAI");
    }

    return parseResponse(response);
}

function validateResponse(response: string): boolean {
    return response.trim() !== "";
}

function parseResponse(response: string): {
    inquiryType: string;
    response: string;
} {
    try {
        const parsedResponse = JSON.parse(response);
        if ("inquiryType" in parsedResponse && "response" in parsedResponse) {
            return parsedResponse;
        } else {
            throw new Error("Missing inquiryType or response property");
        }
    } catch (error) {
        const err = error as Error;
        throw new Error(`Error parsing GPT response: ${err.message}`);
    }
}
