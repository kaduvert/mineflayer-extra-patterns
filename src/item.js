module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.pattern.item = {}

    bot.pattern.item.matchesPattern = (itemPattern, stack) => {
        const { title: titleRegex, lore: loreRegex } = itemPattern
        const stackName = stack.customName
        const stackLore = stack.customLore
        let matchesName = true
        if (titleRegex) {
            matchesName = stackName ? titleRegex.test(stackName.replace(/§./g, '')) : false
        }
        let matchesLore = true
        if (loreRegex?.length) {
            for (let i = 0; i < loreRegex.length; i++) {
                matchesLore = stackLore[i] ? loreRegex[i].test(stackLore[i].replace(/§./g, '')) : false
                if (!matchesLore) break
            }
        }
        return matchesName && matchesLore
    }

    bot.pattern.item.getPatternMatches = (itemPattern, stack) => {
        const { title: titleRegex, lore: loreRegex } = itemPattern
        const stackName = stack.customName
        const stackLore = stack.customLore
        const matches = {
            titleMatch: null,
            loreMatches: null
        }
        if (titleRegex && stackName) {
            matches.titleMatch = stackName.replace(/§./g, '').match(titleRegex).splice(1)
        }
        if (loreRegex) {
            matches.loreMatches = []
            for (let i = 0; i < loreRegex.length; i++) {
                matches.loreMatches[i] = stackLore.replace(/§./g, '').match(loreRegex[i]).splice(1)
            }
        }
        return matches
    }

    bot.pattern.item.findMatchingIn = (window, itemPattern) => {
        return window.slots.find(e => bot.pattern.item.matchesPattern(e, itemPattern))
    }
}