import {Environment} from "../environment";
import {MessageEmbed, MessageEmbedOptions} from "discord.js";


export class MoussaillonMessageEmbed extends MessageEmbed {

    // constructor(data?: MessageEmbed | MessageEmbedOptions) {
    //     super(data);
    //     this.decorateEmbed();
    // }

    constructor() {
        super();
        this.decorateEmbed();
    }

    private decorateEmbed() {
        super.setColor(Environment.getInstance().getEmbedColor())
        super.setFooter("Moussaillon Bot by Jorodan", "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096");
    }
}