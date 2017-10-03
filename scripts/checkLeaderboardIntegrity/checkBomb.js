const _ = require("lodash");

module.exports = function (player) {
    const progressions = player.progressions.sort((a, b) => b.created_at - a.created_at);

    /** grab all deltas for the known playdays */
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
            const pCasual = _.get(prev, "stats.casual.played", 0);
            const cCasual = _.get(curr, "stats.casual.played", 0);

            const dBomb = cBomb - pBomb;
            const dSecure = cSecure - pSecure;
            const dHostage = cHostage - pHostage;
            const dRanked = cRanked - pRanked;
            const dCasual = cCasual - pCasual;

            const bombPlayed = Math.min(dRanked, dBomb);

            return (dRanked > 0)
                ? {
                    bomb: acc.bomb + dBomb,
                    secure: acc.secure + dSecure,
                    hostage: acc.hostage + dHostage,
                    total: acc.total + dBomb + dSecure + dHostage,
                    ranked: acc.ranked + dRanked,
                    casual: acc.casual + dCasual,
                    bombPlayed
                }
                : acc;
        }, { bomb: 0, secure: 0, hostage: 0, total: 0, ranked: 0, casual: 0 });


    /**
     * here is where we get the actual percentage
     * bombPlayed is the minimum between dBomb and dRanked.
     * this means the following:
     * if a played has more bomb games than ranked in a day, then the algo will assume
     * ALL of the ranked games were bomb.
     * this is heavily favored towards the player! the mode spread is way more uniform in practice.
     * we will however always calculate in favor of the player to reduce false positives.
     */
    const bombP = played.total > 0
        ? played.bombPlayed / (played.ranked || Infinity)
        : 0;

    /** return our data to be displayed */
    return{
        platform: _.get(player, "platform"),
        placement: _.get(player, "placements.global", null),
        id: _.get(player, "id"),
        name: _.get(player, "name"),
        bombPercentage: Number.parseFloat((bombP * 100).toFixed(2)),
        bomb: played.bomb,
        ranked: played.ranked,
        total: played.total,
    };
}

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;