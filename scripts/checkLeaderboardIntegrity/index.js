const getLeaderboardPlayers = require("./getLeaderboardPlayers");
const checkBomb = require("./checkBomb");
const _ = require("lodash");
require("console.table");

const pcProm = getLeaderboardPlayers("PC");
const ps4Prom = getLeaderboardPlayers("PS4");
const xboxProm = getLeaderboardPlayers("XBOX");

Promise.all([pcProm, ps4Prom, xboxProm])
    .then(res => {
        const players = _.flatten(res);
        const result = players.map(checkBomb)
            .filter(x => x.total)
            .filter(x => x.bombPercentage < 20)
            .sort((a, b) => a.bombPercentage - b.bombPercentage);
        console.log('%s players found', result.length);
        console.table(result);
    })
    .catch(console.error);