import { validateGPTResponse, parseGptResponse } from "./gptService";

describe("validateGPTResponse", () => {
    it("should return true for a non-empty string", () => {
        const response = "Some GPT response";
        const result = validateGPTResponse(response);
        expect(result).toBe(true);
    });

    it("should return false for an empty string", () => {
        const response = "";
        const result = validateGPTResponse(response);
        expect(result).toBe(false);
    });

    it("should return false for a string with only whitespace", () => {
        const response = "   ";
        const result = validateGPTResponse(response);
        expect(result).toBe(false);
    });
});

describe("parseGptResponse", () => {
    it("should return an object with inquiryType and response properties for a valid JSON string", () => {
        const response = `{
        "inquiryType": "General",
        "response": "Thank you for your message."
    }`;
        const result = parseGptResponse(response);
        expect(result).toEqual({
            inquiryType: "General",
            response: "Thank you for your message.",
        });
    });

    it("should throw an error for an invalid JSON string", () => {
        const response = `{
        "inquiryType": "General",
        "response": "Thank you for your message."
    `;
        expect(() => parseGptResponse(response)).toThrow(
            "Error parsing GPT response: Unexpected end of JSON input"
        );
    });

    it("should throw an error for a JSON string with missing properties", () => {
        const response = `{
        "inquiryType": "General"
    }`;
        expect(() => parseGptResponse(response)).toThrow(
            "Error parsing GPT response: Missing inquiryType or response property"
        );
    });
});
