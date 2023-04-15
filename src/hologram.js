module.exports = function inject(bot, options) {
    const defaultVerticalHologramSpacing = 0.25
    const maxVerticalHologramSpacing = defaultVerticalHologramSpacing + 0.15
    const maxXZSpacing = 0.1

    bot.pattern.hologram = {}

    bot.pattern.hologram.hasNametag = (entity) => Boolean(entity.metadata?.[2])

    bot.pattern.hologram.getNametag = (entity) => entity.metadata[2]

    bot.pattern.hologram.isHologram = (entity) => entity.objectType === 'Armor Stand' && bot.pattern.hologram.hasNametag(entity)

    bot.pattern.hologram.getPosition = (entity) => entity.position.offset(0, entity.position.height, 0)

    bot.pattern.hologram.group = (hologramEntities) => {
        const stackedHolograms = []

        for (const hologramEntity of hologramEntities) {
            let foundGroup = false
            stackedHologramsLoop:
            for (const group of stackedHolograms) {
                for (const groupedHologramEntity of group) {
                    const groupedHologramEntityPosition = bot.pattern.hologram.getPosition(groupedHologramEntity)
                    const hologramEntityPosition = bot.pattern.hologram.getPosition(hologramEntity)
                    if (
                        Math.abs(groupedHologramEntityPosition.y - hologramEntityPosition.y) <= maxVerticalHologramSpacing &&
                        groupedHologramEntityPosition.xzDistanceTo(hologramEntityPosition) <= maxXZSpacing
                    ) {
                        group.push(hologramEntity)
                        foundGroup = true
                        break stackedHologramsLoop
                    }
                }
            }
            if (!foundGroup) {
                stackedHolograms.push([hologramEntity])
            }
        }
        stackedHolograms.forEach(group => bot.pattern.hologram.sort(group))

        return stackedHolograms
    }

    bot.pattern.hologram.sort = (stackedHolograms) => stackedHolograms.sort((a, b) => {
        const aY = bot.pattern.hologram.getPosition(a).y
        const bY = bot.pattern.hologram.getPosition(b).y
        const distance = bY - aY

        return distance / defaultVerticalHologramSpacing // 0.25 is the usual y distance between hologramEntities
    })

    bot.pattern.hologram.extractText = (hologramEntities) => hologramEntities.map(bot.pattern.hologram.getNametag)

    bot.pattern.hologram.getHolograms = (point) =>
        Object.values(bot.entities)
            .filter(bot.pattern.hologram.isHologram)
            // sort by closest distance
            .sort((a, b) => point.distanceTo(bot.pattern.hologram.getPosition(a)) - point.distanceTo(bot.pattern.hologram.getPosition(b)))

    bot.pattern.hologram.match = (stackedHologramText, hologramPattern) => bot.pattern.matchArray(stackedHologramText, hologramPattern)

    bot.pattern.hologram.findMatching = (pattern, point = bot.entity.position) => {
        const loadedHolograms = bot.pattern.hologram.getHolograms(point)
        const stackedHolograms = bot.pattern.hologram.group(loadedHolograms)

        for (const stackedHologram of stackedHolograms) {

            const stackedHologramText = bot.pattern.hologram.extractText(stackedHologram)

            if (bot.pattern.hologram.match(stackedHologramText, pattern)) {
                return stackedHologramText
            }
        }
        return null
    }
}
