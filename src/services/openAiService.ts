import { Configuration, OpenAIApi } from "openai";
import { OpenAiCompletionParams } from "../types";
import { getEnvVariables } from "../config";
const CONFIG = getEnvVariables();
const configuration = new Configuration({
    apiKey: CONFIG.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getCompletion({
    prompt,
    model = "text-davinci-003",
    max_tokens = 256,
    frequency_penalty = 0.3,
}: {
    prompt: string;
    model?: string;
    max_tokens?: number;
    frequency_penalty?: number;
}): Promise<string> {
    const params: OpenAiCompletionParams = {
        model,
        prompt,
        max_tokens,
        frequency_penalty,
    };
    const response = await openai.createCompletion(params);
    const text = response.data?.choices[0]?.text || "";

    if (!text.trim()) {
        throw new Error("Invalid response received from OpenAI");
    }
    return text;
}
