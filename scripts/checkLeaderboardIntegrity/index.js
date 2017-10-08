const getLeaderboardPlayers = require("./getLeaderboardPlayers");
const checkBomb = require("./checkBomb");
const _ = require("lodash");
require("console.table");

const pcProm = getLeaderboardPlayers("PC");
const ps4Prom = getLeaderboardPlayers("PS4");
const xboxProm = getLeaderboardPlayers("XBOX");

Promise.all([pcProm, ps4Prom, xboxProm])
    .then(res => {
        const result = _(res)
            .flatten()
            .map(checkBomb)
            .filter(x => x.ranked >= 20)
            .filter(x => x.rankedDays >= 3)
            .filter(x => x.bombPercentage < 15)
            // .sortBy(['bombPercentage'])
            .sortBy(['platform', 'bombPercentage'])
            .value()
        console.log('%s players found', result.length);
        console.table(result);
    })
    .catch(console.error);