const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let newsSchema = new Schema({
    headline: {type: String, required: true, unique: true },
    summary: {type: String, required: true},
    url: {type: String, required: true, unique: true},
});

// Export the model
module.exports = mongoose.model('News', newsSchema);