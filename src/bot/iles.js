'use strict';

exports.handle = function (message, commandParams) {
    data.iles.forEach(function (ile) {
        if (ile.name == commandParams){
            message.channel.send(ile.name + " dans la mer " + ile.sea)
        }
    })
}