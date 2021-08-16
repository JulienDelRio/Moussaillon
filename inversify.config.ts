import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./src/types";
import {MoussaillonBot} from "./src/bot/moussaillon-bot";
import {Client, Intents} from "discord.js";
import {MessageResponder} from "./src/services/commands/message-responder";

let container = new Container();

container.bind<MoussaillonBot>(TYPES.MoussaillonBot).to(MoussaillonBot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS]
}));
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();

export default container;