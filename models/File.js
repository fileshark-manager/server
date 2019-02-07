const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please enter a file name!'
    },
    url: {
        type: String
    },
    alt: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    folder: {
        type: String
    },
    filename: {
        type: String
    },
    dimensions: {
        type: String
    },
    size: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

fileSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('File', fileSchema);
