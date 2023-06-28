import { sendEmail as mySendEmail } from "./emailService";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { logger } from "../logger";

// Mock the Resend and logger modules
jest.mock("resend");
jest.mock("../logger");

describe("POST /message - Send Email", () => {
    it("should send email and return true when successful", async () => {
        // Create a mock email data
        const mockEmail = {
            to: "john.doe@example.com",
            subject: "General",
            body: "Some email body",
        };

        // Use jest.spyOn to get the mocked functions from Resend and logger modules
        const resendSpy = jest.spyOn(resend, "sendEmail");
        const loggerSpy = jest.spyOn(logger, "error");

        // Mock the return value of the resend function to be a resolved promise
        resendSpy.mockResolvedValue({
            id: "some-id",
        });
        // Call the sendEmail function with the mock email data
        const result = await mySendEmail(mockEmail);

        // Expect the logger function not to be called
        expect(loggerSpy).not.toHaveBeenCalled();

        // Expect the result to be true
        expect(result).toBe(true);
    });
});
