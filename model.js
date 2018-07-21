// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var schema_object = {
	name: String,
	year: Number,
	battle_number: Number,
	attacker_king: String,
	defender_king: String,
	attacker_1: String,
	attacker_2: String,
	attacker_3: String,
	attacker_4: String,
	defender_1: String,
	defender_2: String,
	defender_3: String,
	defender_4: String,
	attacker_outcome: String,
	battle_type: String,
	major_death: Number,
	major_capture: Number,
	attacker_size: Number,
	defender_size: Number,
	attacker_commander: String,
	defender_commander: String,
	summer: String,
	location: String,
	region: String,
	note: String
}
var battleSchema = new Schema(schema_object);
var Battle = mongoose.model('Battle', battleSchema);
Battle.schema_object=schema_object;

module.exports = Battle;