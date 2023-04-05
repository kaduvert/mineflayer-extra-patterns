// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)

    bot.pattern.window = {
        patterns: {}
    }

    bot.pattern.window.getTranslatedTitle = (window) => ChatMessage.fromNotch(window.title).toString()

    bot.pattern.window.match = (title, windowPattern) => bot.pattern.match(title, windowPattern)

    bot.on('windowOpen', (window) => {
        const title = bot.pattern.window.getTranslatedTitle(window)
        const windowPatterns = bot.pattern.window.patterns
        Object.keys(windowPatterns).forEach(windowPatternName => {
            const windowPattern = windowPatterns[windowPatternName]

            const windowTitleMatch = bot.pattern.window.match(title, windowPattern)
            if (windowTitleMatch) {
                bot.emit('windowOpen:' + windowPatternName, window, windowTitleMatch)
            }
        })
    })
}
