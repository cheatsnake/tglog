import { URLSearchParams } from "node:url";
import { httpRequest } from "./http.js";

const TG_API_HOSTNAME = "api.telegram.org";
const TG_METHODS = { sendMessage: "sendMessage" };

//** See: https://core.telegram.org/bots/api#sendmessage */
export interface MessageParams {
    chatId: string;
    messageThreadId?: number;
    parseMode?: "HTML" | "MarkdownV2" | "Markdown";
    disableNotification?: boolean;
}

export interface TelegramResponse {
    ok: boolean;
    result?: Object;
    error_code?: number;
    description?: string;
}

export class TelegramBot {
    private token: string;
    private messageParams: MessageParams;

    constructor(token: string, messageParams: MessageParams) {
        this.token = token;
        this.messageParams = messageParams;
    }

    async sendMessage(text: string, parameters?: Partial<MessageParams>) {
        try {
            const params = parameters ? { ...this.messageParams, ...parameters } : this.messageParams;
            const options = this.sendMessageOptions(text, params);

            const resp = await httpRequest(options);
            const json: TelegramResponse = JSON.parse(resp.toString("utf-8"));

            return json;
        } catch (error) {
            throw error;
        }
    }

    private sendMessageOptions = (text: string, params: MessageParams) => {
        const query = new URLSearchParams();

        if (params?.messageThreadId) query.append("message_thread_id", `${params.messageThreadId}`);
        if (params?.parseMode) query.append("parse_mode", params.parseMode);
        if (params?.disableNotification) query.append("disable_notification", "true");

        query.append("chat_id", params.chatId);
        query.append("text", text);

        return {
            method: "GET",
            hostname: TG_API_HOSTNAME,
            path: `/bot${this.token}/${TG_METHODS.sendMessage}?${query.toString()}`,
        };
    };
}

export const bold = (s: string, params: Partial<MessageParams>) => {
    if (params.parseMode === "HTML") return `<b>${s}</b>`;
    if (params.parseMode?.includes("Markdown")) return `*${s}*`;
    return s;
};
