const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    headline: {type: String, required: true, unique: true },
    summary: {type: String, required: true},
    url: {type: String, required: true, unique: true},
    saved: {type: Boolean, default: false}
});

// This creates our model from the above schema, using mongoose's model method
const News = mongoose.model('News', NewsSchema);

// Export the Article model
module.exports = News;