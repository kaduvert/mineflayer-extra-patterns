module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.pattern.item = {}

    bot.pattern.item.match = (stack, itemPattern) => bot.pattern.matchArray(itemPattern, [stack.stackName, ...stack.stackLore])

    bot.pattern.item.findInWindow = (window, itemPattern) => {
        return window.slots.find(e => bot.pattern.item.match(e, itemPattern))
    }
}
