const mongoose = require('mongoose');
const fileExtension = require('file-extension');

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
    toJSON: {virtuals: true, getters: true},
    toObject: {virtuals: true, getters: true}
});

fileSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

fileSchema.virtual('extension').get(function() {
    return fileExtension(this.url);
});

fileSchema.path('url').get(function(value) {
    return `${process.env.HOST}${value}`;
});

module.exports = mongoose.model('File', fileSchema);
