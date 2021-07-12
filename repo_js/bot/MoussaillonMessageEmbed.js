'use strict';

const config = require('./config.json');
const {MessageEmbed} = require("discord.js");

class MoussaillonMessageEmbed extends MessageEmbed {

    constructor(data, skipValidation) {
        super(data, skipValidation);
        super.setColor(config.embedColor)
        super.setFooter("Moussaillon Bot by Jorodan", "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096");
    }
}

module.exports = MoussaillonMessageEmbed;