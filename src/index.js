const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('hologram'),
    getPlugin('window'),
    getPlugin('item'),
]

module.exports = function inject(bot, options) {
    bot.pattern = {}

    bot.pattern.clearColorCodes = (str) => str?.replace(/§./g, '')

    bot.pattern.match = (str, reg) => bot.pattern.clearColorCodes(str)?.match(reg)?.splice(1)

    bot.pattern.matchArray = (regArr, matchArr) => {
        if (!(regArr instanceof Array)) {
            regArr = [regArr]
        }

        let matchesPattern = true
        const regArrMatches = []
        if (regArr?.length) {
            for (let i = 0; i < regArr.length; i++) {
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
