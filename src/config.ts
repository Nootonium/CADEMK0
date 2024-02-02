import dotenv from "dotenv";

export function getEnvVariables() {
    const env = process.env.NODE_ENV || "development";
    const envFile = env === "test" ? ".env.test" : ".env";
    dotenv.config({ path: envFile });

    const defaults = {
        PORT: 3000,
        MONGODB_URI: "mongodb://localhost:27017/cadedev",
        EMAIL_SERVICE_API_KEY: "",
        OPENAI_API_KEY: "",
        ALLOWED_ORIGIN: "*",
        FROM_EMAIL: "onboarding@resend.dev",
        DISCORD_BOT_TOKEN: "",
        DISCORD_CLIENT_ID: "",
        GITHUB_API_TOKEN: "",
    };

    const {
        PORT = defaults.PORT,
        MONGODB_URI = defaults.MONGODB_URI,
        EMAIL_SERVICE_API_KEY = defaults.EMAIL_SERVICE_API_KEY,
        OPENAI_API_KEY = defaults.OPENAI_API_KEY,
        ALLOWED_ORIGIN = defaults.ALLOWED_ORIGIN,
        FROM_EMAIL = defaults.FROM_EMAIL,
        DISCORD_BOT_TOKEN = defaults.DISCORD_BOT_TOKEN,
        DISCORD_CLIENT_ID = defaults.DISCORD_CLIENT_ID,
        GITHUB_API_TOKEN = defaults.GITHUB_API_TOKEN,
    } = process.env;

    return {
        PORT: Number(PORT),
        MONGODB_URI,
        EMAIL_SERVICE_API_KEY,
        OPENAI_API_KEY,
        ALLOWED_ORIGIN,
        FROM_EMAIL,
        DISCORD_BOT_TOKEN,
        DISCORD_CLIENT_ID,
        GITHUB_API_TOKEN,
    };
}
