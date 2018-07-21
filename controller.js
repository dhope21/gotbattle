var Battle = require('./model');
var _ = require('lodash');



async function getMostActive() {
    let most_active = {};
    let attacker_king = await Battle.aggregate([
        {
            "$group": {
                "_id": "$attacker_king",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    most_active.attacker_king = _.maxBy(attacker_king, o => o.sum)._id;


    let defender_king = await Battle.aggregate([
        {
            "$group": {
                "_id": "$defender_king",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    most_active.defender_king = _.maxBy(defender_king, o => o.sum)._id;

    let region = await Battle.aggregate([
        {
            "$group": {
                "_id": "$region",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    most_active.region = _.maxBy(region, o => o.sum)._id;

    let name = await Battle.aggregate([
        {
            "$group": {
                "_id": "$name",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    most_active.name = _.maxBy(name, o => o.sum)._id;


    return most_active;
}


async function getAttackerOutcome() {

    let attacker_outcome = await Battle.aggregate([
        {
            "$group": {
                "_id": "$attacker_outcome",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    attacker_outcome = _.map(attacker_outcome, o => {
        let outcome = {};
        outcome[o._id] = o.sum;
        return outcome;
    });
    return attacker_outcome;
}
async function getBattleTypes() {
    let battle_type = await Battle.aggregate([
        {
            "$group": {
                "_id": "$battle_type",
                "sum": { "$sum": 1 }
            }
        }
    ]);
    battle_type = _.map(battle_type, o => o._id);
    return battle_type;
}

async function getDefenderSize() {
    let defender_size = await Battle.aggregate([
        {
            "$group": {
                "_id": null,
                "max": { "$max": "$defender_size" },
                "min": { "$min": "$defender_size" },
                "avg": { "$avg": "$defender_size" }
            }
        }
    ]);

    return defender_size[0];
}

var controller = {

    updateQuery(urlQuery) {
        console.log("urlQuery", urlQuery);
        var urlKeys = Object.keys(urlQuery);
        var modelKeys = Object.keys(Battle.schema_object);
        var dbQuery = { $and: [] }
        for (let j = 0; j < urlKeys.length; j++) {
            var orQuery = { $or: [] };
            for (let i = 0; i < modelKeys.length; i++) {
                let queryCounter = 0;
                if (modelKeys[i] == urlKeys[j]) {
                    dbQuery.$and.push({
                        [modelKeys[i]]: urlQuery[urlKeys[j]
                        ]
                    });
                } else if (modelKeys[i].indexOf(urlKeys[j]) > -1) {
                    console.log(modelKeys[i], urlKeys[j]);
                    orQuery.$or.push({
                        [modelKeys[i]]: urlQuery[urlKeys[j]]
                    });
                }
            }
            if (orQuery.$or.length > 0) dbQuery.$and.push(orQuery);
        }
        // console.log("keys",urlKeys,dbQuery);
        return dbQuery;
    },

    async getStats(req, res) {
        let stat_object = {};

        stat_object.most_active = await getMostActive();

        stat_object.attacker_outcome = await getAttackerOutcome();

        stat_object.battle_type = await getBattleTypes();

        stat_object.defender_size = await getDefenderSize();
        console.log(stat_object);
        res.send(stat_object);
    }

}

module.exports = controller;