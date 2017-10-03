const _ = require("lodash");

module.exports = function (player) {
    const progressions = player.progressions.sort((a, b) => b.created_at - a.created_at);

    const played = progressions.slice(1)
        .reduce((acc, prev, i) => {
            const curr = progressions[i];
            const pBomb = _.get(prev, "stats.bomb.played", 0);
            const cBomb = _.get(curr, "stats.bomb.played", 0);
            const pSecure = _.get(prev, "stats.secure.played", 0);
            const cSecure = _.get(curr, "stats.secure.played", 0);
            const pHostage = _.get(prev, "stats.hostage.played", 0);
            const cHostage = _.get(curr, "stats.hostage.played", 0);
            const pRanked = _.get(prev, "stats.ranked.played", 0);
            const cRanked = _.get(curr, "stats.ranked.played", 0);

            const dBomb = cBomb - pBomb;
            const dSecure = cSecure - pSecure;
            const dHostage = cHostage - pHostage;
            const dRanked = cRanked - pRanked;
            const bombPlayed = Math.min(dRanked, dBomb)

            return {
                bomb: acc.bomb + bombPlayed,
                secure: acc.secure + dSecure,
                hostage: acc.hostage + dHostage,
                total: acc.total + bombPlayed + dSecure + dHostage
            }
        }, { bomb: 0, secure: 0, hostage: 0, total: 0 });

    const bombP = played.total ? played.bomb / (played.bomb + played.hostage + played.secure) : 0;

    return {
        id: _.get(player, "id"),
        name: _.get(player, "name"),
        platform: _.get(player, "platform"),
        placement: _.get(player, "placements.global", null),
        bomb: played.bomb,
        secure: played.secure,
        hostage: played.hostage,
        total: played.total,
        bombP: Number.parseFloat((bombP*100).toFixed(2))
    };
}

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;