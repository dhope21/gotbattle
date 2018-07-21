
const mongoose = require('mongoose');

const csvFilePath = './battles.csv';
const csv = require('csvtojson');
var Battle = require('./model');

// // mongoose connection
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

// this function loads csv data into json format
// and then pushes every record to mongo database
async function uploadCscToMongo() {
    const all_battles = await csv().fromFile(csvFilePath);
    console.log("json", all_battles.length);
    for (let i = 0; i < all_battles.length; i++) {
        const battle = all_battles[i];
        // console.log(battle);
        let new_battle = Battle(battle);
        new_battle.save(function (err, data) {
            if (err) throw err;
            console.log('User created!', data);
        });
        // console.log("CSV upload complete");
    }
}
// this function deletes all records in mongodb one my one
async function deleteAllBattles() {
    Battle.find({}, function (err, data) {
        if (err) throw err;
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            data[i].remove(function (err) {
                if (err) throw err;
                console.log('User successfully deleted!', i);
            });
            // console.log("removed all battles");
        }
    });
}

uploadCscToMongo();

// deleteAllBattles();