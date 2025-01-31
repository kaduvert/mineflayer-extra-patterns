const plugins = [
    require('./hologram'),
    require('./window'),
    require('./item'),
]

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)

    bot.pattern = {}

    bot.pattern.clearColorCodes = (unknown) => (
        (typeof unknown === 'string') ?
        ChatMessage.fromNotch(unknown) :
        (new ChatMessage(unknown))
    ).toString()

    bot.pattern.match = (str, reg) => bot.pattern.clearColorCodes(str)?.match(reg)?.splice(1)

    bot.pattern.matchArray = (matchArr, regArr) => {
        if (!(regArr instanceof Array)) {
            regArr = [regArr]
        }

        let matchesPattern = true
        const regArrMatches = []
        if (regArr?.length) {
            for (let i = 0; i < regArr.length; i++) {
                if (!regArr[i]) {
                    regArrMatches[i] = matchArr[i]
                    continue
                }
                const regArrMatch = bot.pattern.match(matchArr[i], regArr[i])
                if (regArrMatch) {
                    regArrMatches[i] = regArrMatch
                } else {
                    matchesPattern = false
                    break
                }
            }
        }
        return matchesPattern ? regArrMatches : null
    }

    bot.patternHeadNameSeparator = '->' // example event name: chat:itemClear->nextIn

    bot.loadPlugins(plugins)
}
