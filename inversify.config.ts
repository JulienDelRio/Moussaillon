import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./src/types";
import {MoussaillonBot} from "./src/bot/moussaillon-bot";
import {Client} from "discord.js";
import {MessageResponder} from "./src/services/commands/message-responder";
import {ReloadDataCommand} from "./src/services/commands/reload-data-command";
import {Environment} from "./src/tools/environment";

let container = new Container();

container.bind<MoussaillonBot>(TYPES.MoussaillonBot).to(MoussaillonBot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(Environment.getInstance().getBotToken());
container.bind<string>(TYPES.CommandChar).toConstantValue(Environment.getInstance().getCommandChar());
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<ReloadDataCommand>(TYPES.ReloadDataCommand).to(ReloadDataCommand).inSingletonScope();

export default container;