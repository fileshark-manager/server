const mongoose = require('mongoose');
const File = mongoose.model('File');

exports.getAll = async (req, res) => {
    const {page = 1, folder = ''} = req.query;
    const limit = 25;
    const skip = (page * limit) - limit;

    const filesPromise = File
        .find({folder})
        .skip(skip)
        .limit(limit)
        .sort({created: 'desc'});

    const countPromise = File.count();

    const [files, count] = await Promise.all([filesPromise, countPromise]);
    const hasMore = (skip + limit) < count;

    res.json({list: files, hasMore});
};

exports.get = async (req, res) => {
    const file = await File.find({_id: req.params.id});

    res.json(file);
};

exports.create = async (req, res) => {
    // handle file upload mechanics
    const file = await (new File(req.body)).save();

    res.json(file);
};
