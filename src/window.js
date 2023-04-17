// const EventEmitter = require('events')

const surroundingsShorts = {
    top: -9,
    bottom: 9,
    left: -1,
    right: 1
}

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)

    bot.pattern.window = {
        patterns: {}
    }

    bot.pattern.window.getTranslatedTitle = (window) => ChatMessage.fromNotch(window.title).toString()

    bot.pattern.window.matchTitle = (title, pattern) => bot.pattern.match(title, pattern)

    bot.pattern.window.match = bot.pattern.window.matchTitle

    bot.pattern.window.matchSlotFormation = (window, slot, slotFormation) => {
        let match = bot.pattern.item.match(slot, slotFormation.center)
        let isMatching = match !== null
        if (match) {
            for (const surroundingKey in slotFormation.surroundings) {
                const slotOffset = surroundingsShorts[surroundingKey] ?? +surroundingKey
                const surroundingItemPattern = slotFormation.surroundings[surroundingKey]
                const itemAtOffset = window.slots[slot.slot + slotOffset]
                const surroundingItemMatch = bot.pattern.item.match(itemAtOffset, surroundingItemPattern)
                if (!surroundingItemMatch) {
                    isMatching = false
                    break
                }
            }
        }
        return isMatching ? match : null
    }
}
