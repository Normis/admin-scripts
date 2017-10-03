const qs = require("querystring");
const { FETCH_OPTS, PLATFORMS } = require("./constants");
const fetch = require("node-fetch");
module.exports = async function (platform) {
    const leaderboard = await getLeaderboard(platform);
    const ids = leaderboard.map(x => x.id);

    const players = await getPlayers(ids);

    return players;
}


async function getLeaderboard(platform) {
    if (PLATFORMS.every(p => p !== platform)) {
        throw new Error("platform not recognized");
    }
    else {
        const query = qs.stringify({
            stat: "highest_skill_adjusted",
            platform,
            limit: 100
        });
        return fetch(`https://r6db.com/api/v2/leaderboards?${query}`, FETCH_OPTS)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("bad response status (" + res.stats + ")");
                }
                return res.json();
            })
            .catch(err => {
                console.log(err);
            });
    }
}

async function getPlayers(ids) {
    if (!Array.isArray(ids)) {
        throw new Error("players is not an array");
    } else {
        const query = qs.stringify({ ids });
        return fetch(`https://r6db.com/api/v2/players?${query}`, FETCH_OPTS)
            .then(async res => {
                if (res.status !== 200) {
                    const body = await res.text();
                    throw new Error(body);
                }
                return res.json();
            })
            .catch(err => {
                console.log(err);
            });
    }
}