// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)

    bot.pattern.window = {
        patterns: {}
    }

    bot.pattern.window.loadPatterns = (windowPatterns, patternHead) => {
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.pattern.window.patterns[patternHead + bot.patternHeadNameSeparator + windowPatternName] = windowPatterns[windowPatternName]
        })
    }

    bot.pattern.window.getTranslatedTitle = (window) => ChatMessage.fromNotch(window.title).toString()

    bot.on('windowOpen', (window) => {
        const title = bot.pattern.window.getTranslatedTitle(window)
        const windowPatterns = bot.pattern.window.patterns
        Object.keys(windowPatterns).forEach(windowPatternName => {
            const windowPattern = windowPatterns[windowPatternName]

            const windowTitleMatch = bot.pattern.match(title, windowPattern)
            if (windowTitleMatch) {
                bot.emit('windowOpen:' + windowPatternName, window, windowTitleMatch)
            }
        })
    })
}
