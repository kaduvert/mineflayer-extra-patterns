module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.pattern.item = {}

    bot.pattern.item.match = (stack, itemPattern) => {
        const { title: titleRegex, lore: loreRegex } = itemPattern
        const stackName = stack.customName
        const stackLore = stack.customLore

        let matchesPattern = true
        const patternMatches = {
            titleMatch: null,
            loreMatches: null
        }
        if (titleRegex) {
            const titleMatch = bot.pattern.match(stackName, titleRegex)
            if (titleMatch) {
                matches.titleMatch = titleMatch
            } else {
                matchesPattern = false
            }
        }
        const loreMatches = bot.pattern.matchArray(loreRegex, stackLore)
        if (loreMatches) {
            patternMatches.loreMatches = loreMatches
        } else {
            matchesPattern = false
        }
        return matchesPattern ? patternMatches : null
    }

    bot.pattern.item.findInWindow = (window, itemPattern) => {
        return window.slots.find(e => bot.pattern.item.match(e, itemPattern))
    }
}