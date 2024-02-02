import https from "https";
import { getEnvVariables } from "../../config";

const { GITHUB_API_TOKEN } = getEnvVariables();
const GITHUB_API_BASE = "api.github.com";
const USER_AGENT = "Node.js";

const githubService = {
    checkRepoExists: async (repoId: string) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: GITHUB_API_BASE,
                path: `/repos/${repoId}`,
                method: "GET",
                headers: {
                    "User-Agent": USER_AGENT,
                    Authorization: `token ${GITHUB_API_TOKEN}`,
                },
            };

            https
                .get(options, (res) => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    } else if (res.statusCode === 404) {
                        resolve(false);
                    } else {
                        resolve(false);
                    }
                })
                .on("error", (e) => {
                    reject(e);
                });
        });
    },
};

export default githubService;
