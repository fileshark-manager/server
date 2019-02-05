const mongoose = require('mongoose');
const Folder = mongoose.model('Folder');

exports.getAll = async (req, res) => {
    const folders = await Folder.find();

    res.json(folders);
};

exports.get = async (req, res) => {
    const folder = await Folder.find({_id: req.params.id});

    res.json(folder);
};

exports.create = async (req, res) => {
    const folder = await (new Folder(req.body)).save();

    res.json(folder);
};
