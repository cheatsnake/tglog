import https from "node:https";

export const httpRequest = async (options: string | https.RequestOptions): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, async (res) => {
            const chunks: Buffer[] = [];

            res.on("data", (chunk) => {
                chunks.push(chunk);
            });

            res.on("end", async () => {
                const body = Buffer.concat(chunks);
                resolve(body);
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    });
};
