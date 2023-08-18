module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.pattern.item = {}

    bot.pattern.item.matchDisplay = (stack, displayPattern) => bot.pattern.matchArray([stack.stackName].concat(stack.stackLore), displayPattern)

    bot.pattern.item.match = bot.pattern.item.matchDisplay
}
