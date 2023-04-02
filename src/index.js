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

    bot.patternHeadNameSeparator = '->' // example event name: chat:itemClear->nextIn

    bot.loadPlugins(plugins)
}
