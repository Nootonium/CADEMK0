import { Configuration, OpenAIApi } from "openai";
import { OpenAiCompletionParams } from "../types";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface CreateCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
}

interface Choice {
    text: string;
    index: number;
    logprobs: null | any;
    finish_reason: string;
}

interface GptPrompt {
    name: string;
    message: string;
}

export function buildGptPrompt({ name, message }: GptPrompt): string {
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

export async function getGptResponse({
    name,
    message,
}: {
    name: string;
    message: string;
}) {
    const gptPrompt = buildGptPrompt({ name, message });
    const params: OpenAiCompletionParams = {
        model: "text-davinci-003",
        prompt: gptPrompt,
        max_tokens: 256,
        frequency_penalty: 0.3,
    };
    return await getCompletion(params);
}

export function validateResponse(response: string): boolean {
    return response.trim() !== "";
}

export function parseGptResponse(response: string): {inquiryType: string, response: string} {
    try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
    } catch (error) {
        const err = error as Error;
        throw new Error(`Error parsing GPT response: ${err.message}`);
    }
}
