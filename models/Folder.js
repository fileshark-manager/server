const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const folderSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please enter a folder name!'
    },
    description: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Folder', folderSchema);
