import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./src/types";
import {MoussaillonBot} from "./src/bot/moussaillon-bot";
import {Client} from "discord.js";
import {MessageResponder} from "./src/services/commands/message-responder";
import {ReloadDataCommand} from "./src/services/commands/reload-data-command";

let container = new Container();

container.bind<MoussaillonBot>(TYPES.MoussaillonBot).to(MoussaillonBot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.BOT_TOKEN);
container.bind<string>(TYPES.CommandChar).toConstantValue(process.env.COMMAND_CHAR);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<ReloadDataCommand>(TYPES.ReloadDataCommand).to(ReloadDataCommand).inSingletonScope();

export default container;

// Make process available
declare var process: {
    env: {
        BOT_TOKEN: string,
        COMMAND_CHAR: string
    }
}