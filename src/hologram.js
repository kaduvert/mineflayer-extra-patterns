module.exports = function inject(bot, options) {
    bot.pattern.hologram = {}

    bot.pattern.hologram.hasNametag = (entity) => Boolean(entity.metadata?.[2])

    bot.pattern.hologram.getNametag = (entity) => entity.metadata[2]

    bot.pattern.hologram.isHologram = (entity) => entity.objectType === 'Armor Stand' && bot.pattern.hologram.hasNametag(entity)

    bot.pattern.hologram.group = (hologramEntities) => {
        const stackedHolograms = []

        for (const hologramEntity of hologramEntities) {
            let foundGroup = false
            stackedHologramsLoop:
            for (const group of stackedHolograms) {
                for (const groupedHologramEntity of group) {
                    if (
                        Math.abs(groupedHologramEntity.position.y - hologramEntity.position.y) <= 0.4 && // yDistance max 0.4 blocks
                        groupedHologramEntity.position.xzDistanceTo(hologramEntity.position) <= 0.1 // xzDistance max 0.1 blocks
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
        const aY = a.position.y
        const bY = b.position.y
        const distance = bY - aY

        return distance / 0.25 // 0.25 is the usual y distance between hologramEntities
    })

    bot.pattern.hologram.extractText = (hologramEntities) => hologramEntities.map(bot.pattern.hologram.getNametag)

    bot.pattern.hologram.getHolograms = (point) => 
        Object.values(bot.entities)
        .filter(bot.pattern.hologram.isHologram)
        // sort by closest distance
        .sort((a, b) => point.distanceTo(a.position) - point.distanceTo(b.position))

    bot.pattern.hologram.findMatching = (pattern, point = bot.entity.position) => {
        const loadedHolograms = bot.pattern.hologram.getHolograms(point)
        const stackedHolograms = bot.pattern.hologram.group(loadedHolograms)

        for (const stackedHologram of stackedHolograms) {

            const stackedHologramText = bot.pattern.hologram.extractText(stackedHologram)

            if (bot.pattern.matchArray(stackedHologramText, pattern)) {
                return stackedHologramText
            }
        }
        return null
    }
}
