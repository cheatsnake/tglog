import { MessageParams, TelegramBot, bold } from "./telegram.js";

const EMOJI = { info: "💬", ok: "✅", warn: "🚧", err: "🚨" };

type LoggerOptions = Omit<MessageParams, "chatId"> & {
    wrapAsCode?: boolean;
    ignoreErrors?: boolean;
    timeMetadata?: boolean;
};

type LogData = string | Object;

export default class TelegramLogger {
    private bot: TelegramBot;
    private options: LoggerOptions;

    constructor(botToken: string, chatId: string, options?: LoggerOptions) {
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

    async info(data: LogData, options?: LoggerOptions) {
        try {
            const opt = options ? { ...this.options, ...options } : this.options;
            const text = this.prepareLog(data, opt, `${EMOJI.info} ${bold("Information", opt)}`);
            const resp = await this.bot.sendMessage(text, opt);
            return resp;
        } catch (error) {
            if ({ ...this.options, ...options }.ignoreErrors) return;
            throw error;
        }
    }

    async ok(data: LogData, options?: LoggerOptions) {
        try {
            const opt = options ? { ...this.options, ...options } : this.options;
            const text = this.prepareLog(data, opt, `${EMOJI.ok} ${bold("Success", opt)}`);
            const resp = await this.bot.sendMessage(text, opt);
            return resp;
        } catch (error) {
            if ({ ...this.options, ...options }.ignoreErrors) return;
            throw error;
        }
    }

    async warn(data: LogData, options?: LoggerOptions) {
        try {
            const opt = options ? { ...this.options, ...options } : this.options;
            const text = this.prepareLog(data, opt, `${EMOJI.warn} ${bold("Warning", opt)}`);
            const resp = await this.bot.sendMessage(text, opt);
            return resp;
        } catch (error) {
            if ({ ...this.options, ...options }.ignoreErrors) return;
            throw error;
        }
    }

    async err(data: LogData, options?: LoggerOptions) {
        try {
            const opt = options ? { ...this.options, ...options } : this.options;
            const text = this.prepareLog(data, opt, `${EMOJI.err} ${bold("Error", opt)}`);
            const resp = await this.bot.sendMessage(text, opt);
            return resp;
        } catch (error) {
            if ({ ...this.options, ...options }.ignoreErrors) return;
            throw error;
        }
    }

    async raw(data: LogData, options?: LoggerOptions) {
        try {
            const opt = options ? { ...this.options, ...options } : this.options;
            const text = this.prepareLog(data, opt);
            const resp = await this.bot.sendMessage(text, opt);
            return resp;
        } catch (error) {
            if ({ ...this.options, ...options }.ignoreErrors) return;
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
