import dotenv from "dotenv";

export function getEnvVariables() {
    const env = process.env.NODE_ENV || "development";
    const envFile = env === "test" ? ".env.test" : ".env";
    dotenv.config({ path: envFile });

    const defaults = {
        PORT: 3000,
        MONGODB_URI: "mongodb://localhost:27017/default",
        EMAIL_SERVICE_API_KEY: "",
        OPENAI_API_KEY: "",
        ALLOWED_ORIGIN: "*",
        FROM_EMAIL: "onboarding@resend.dev",
    };

    const {
        PORT = defaults.PORT,
        MONGODB_URI = defaults.MONGODB_URI,
        EMAIL_SERVICE_API_KEY = defaults.EMAIL_SERVICE_API_KEY,
        OPENAI_API_KEY = defaults.OPENAI_API_KEY,
        ALLOWED_ORIGIN = defaults.ALLOWED_ORIGIN,
        FROM_EMAIL = defaults.FROM_EMAIL,
    } = process.env;

    return {
        PORT: Number(PORT),
        MONGODB_URI,
        EMAIL_SERVICE_API_KEY,
        OPENAI_API_KEY,
        ALLOWED_ORIGIN,
        FROM_EMAIL,
    };
}
