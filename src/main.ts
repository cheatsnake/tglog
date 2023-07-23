import { MessageParams, TelegramBot, bold } from "./telegram.js";

const EMOJI = { info: "💬", ok: "✅", warn: "🚧", err: "🚨" };

type LogOptions = Omit<MessageParams, "chatId"> & {
    wrapAsCode?: boolean;
    ignoreErrors?: boolean;
    timeMetadata?: boolean;
};

type LogData = string | Object;

export default class TelegramLogger {
    private bot: TelegramBot;
    private options: LogOptions;

    constructor(botToken: string, chatId: string, options?: LogOptions) {
        this.bot = new TelegramBot(botToken, { chatId, ...options });
        this.options = {
            wrapAsCode: true,
            ignoreErrors: true,
            parseMode: "HTML",
            disableNotification: false,
            timeMetadata: true,
            ...options,
        };
    }

    async info(data: LogData, options = this.options) {
        try {
            const text = this.prepareLog(data, options, `${EMOJI.info} ${bold("Information", options)}`);
            const resp = await this.bot.sendMessage(text, options);
            return resp;
        } catch (error) {
            if (options.ignoreErrors) return;
            throw error;
        }
    }

    async ok(data: LogData, options = this.options) {
        try {
            const text = this.prepareLog(data, options, `${EMOJI.ok} ${bold("Success", options)}`);
            const resp = await this.bot.sendMessage(text, options);
            return resp;
        } catch (error) {
            if (options.ignoreErrors) return;
            throw error;
        }
    }

    async warn(data: LogData, options = this.options) {
        try {
            const text = this.prepareLog(data, options, `${EMOJI.warn} ${bold("Warning", options)}`);
            const resp = await this.bot.sendMessage(text, options);
            return resp;
        } catch (error) {
            if (options.ignoreErrors) return;
            throw error;
        }
    }

    async err(data: LogData, options = this.options) {
        try {
            const text = this.prepareLog(data, options, `${EMOJI.err} ${bold("Error", options)}`);
            const resp = await this.bot.sendMessage(text, options);
            return resp;
        } catch (error) {
            if (options.ignoreErrors) return;
            throw error;
        }
    }

    async raw(data: LogData, options = this.options) {
        try {
            const text = this.prepareLog(data, options);
            const resp = await this.bot.sendMessage(text, options);
            return resp;
        } catch (error) {
            if (options.ignoreErrors) return;
            throw error;
        }
    }

    private prepareLog(data: LogData, options = this.options, prefix?: string, postfix?: string) {
        let text = typeof data === "string" ? data : JSON.stringify(data, null, 4);

        if (options.wrapAsCode) {
            if (options.parseMode === "HTML") text = `<code>${text}</code>`;
            if (options.parseMode?.includes("Markdown")) text = `\`\`\`\n${text}\n\`\`\``;
        }

        if (prefix) text = `${prefix}\n\n${text}`;
        if (postfix) text = `${text}\n\n${postfix}`;
        if (options.timeMetadata) text = `${text}\n\n${new Date().toLocaleString()}`;

        return text;
    }
}
