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
            .filter(x => x.total >= 10)
            .filter(x => x.bombPercentage < 20)
            // .sortBy(['bombPercentage'])
            .sortBy(['platform', 'placement'])
            .value()
        console.log('%s players found', result.length);
        console.table(result);
    })
    .catch(console.error);