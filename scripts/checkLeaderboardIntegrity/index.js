const api = require("./api");
const checkBomb = require("./checkBomb");
const _ = require("lodash");
require("console.table");

if (process.argv[2]) {
    const res = api.getPlayer(process.argv[2]).then(res => {
        const result = res.map(checkBomb);
        console.table(result);
    });
} else {
    const pcProm = api.getLeaderboard("PC");
    const ps4Prom = api.getLeaderboard("PS4");
    const xboxProm = api.getLeaderboard("XBOX");

    Promise.all([pcProm, ps4Prom, xboxProm])
        .then(res => {
            const result = _(res)
                .flatten()
                .map(checkBomb)
                .filter(x => x.ranked >= 20)
                .filter(x => x.rankedDays >= 3)
                .filter(x => x.bombPercentage < 15)
                .sortBy(["platform", "bombPercentage"])
                .value();
            console.log("%s players found", result.length);
            console.table(result);
        })
        .catch(console.error);
}
