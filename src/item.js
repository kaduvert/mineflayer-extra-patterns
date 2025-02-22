module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.pattern.item = {}

    bot.pattern.item.matchDisplay = (stack, displayPattern) => bot.pattern.matchArray([(stack.customName ?? '')].concat(stack.customLore), displayPattern)

    bot.pattern.item.match = (stack, pattern) => {
        return (
            stack &&
            (pattern.name === undefined || stack.name === pattern.name) &&
            bot.pattern.item.matchDisplay(stack, pattern.display)
        )
    }

    bot.pattern.item.findMatching = (window, pattern) => window.slots.find(stack => bot.pattern.item.match(stack, pattern))
}
