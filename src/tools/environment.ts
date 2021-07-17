export class Environment {
    private static instance: Environment;
    private _botToken: string | undefined;
    private _commandChar: string | undefined;
    private _islandCSVUrl: string | undefined;
    private _membersCSVUrl: string | undefined;
    private _rightsCSVUrl: string | undefined;
    private _embedColor: string | undefined;

    public static getInstance(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }

        return Environment.instance;
    }

    private constructor() {
    }

    getBotToken(): string {
        if (this._botToken === undefined) {
            let botToken = process.env.BOT_TOKEN;
            if (typeof botToken === 'string') {
                this._botToken = botToken;
                return botToken;
            } else {
                throw new Error("Bot token not initialized")
            }
        } else {
            return this._botToken;
        }
    }

    getCommandChar(): string {
        if (this._commandChar === undefined) {
            let commandChar = process.env.COMMAND_CHAR;
            if (typeof commandChar === 'string') {
                this._commandChar = commandChar;
                return commandChar;
            } else {
                throw new Error("Command char not initialized")
            }
        } else {
            return this._commandChar;
        }
    }

    getIslandCSVUrl(): string {
        if (this._islandCSVUrl === undefined) {
            let islandCSVUrl = process.env.ISLANDS_CSVURL;
            if (typeof islandCSVUrl === 'string') {
                this._islandCSVUrl = islandCSVUrl;
                return islandCSVUrl;
            } else {
                throw new Error("Island CSV Url not initialized")
            }
        } else {
            return this._islandCSVUrl;
        }
    }

    getMembersCSVUrl(): string {
        if (this._membersCSVUrl === undefined) {
            let membersCSVUrl = process.env.MEMBERS_CSVURL;
            if (typeof membersCSVUrl === 'string') {
                this._membersCSVUrl = membersCSVUrl;
                return membersCSVUrl;
            } else {
                throw new Error("Members CSV Url not initialized")
            }
        } else {
            return this._membersCSVUrl;
        }
    }

    getRightsCSVUrl(): string {
        if (this._rightsCSVUrl === undefined) {
            let rightsCSVUrl = process.env.RIGHTS_CSVURL;
            if (typeof rightsCSVUrl === 'string') {
                this._rightsCSVUrl = rightsCSVUrl;
                return rightsCSVUrl;
            } else {
                throw new Error("Rights  CSV Url initialized")
            }
        } else {
            return this._rightsCSVUrl;
        }
    }

    getEmbedColor() {
        if (this._embedColor === undefined) {
            let embedColor = process.env.EMBED_COLOR;
            if (typeof embedColor === 'string') {
                this._embedColor = embedColor;
                return embedColor;
            } else {
                throw new Error("Rights  CSV Url initialized")
            }
        } else {
            return this._embedColor;
        }
    }
}
