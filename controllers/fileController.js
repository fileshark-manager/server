const mongoose = require('mongoose');
const File = mongoose.model('File');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (isPhoto) {
            next(null, true);
        } else {
            next({message: 'That filetype is not allowed!'}, false);
        }
    }
};

exports.upload = multer(multerOptions).single('file');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();

        return;
    }

    const extension = req.file.mimetype.split('/')[1];

    const fileName = `${uuid.v4()}.${extension}`;

    req.body.url = `/uploads/${fileName}`;

    const file = await jimp.read(req.file.buffer);

    await file.resize(800, jimp.AUTO);
    await file.write(`./public/uploads/${fileName}`);

    next();
};

exports.getAll = async (req, res) => {
    const {page = 0, folder = ''} = req.query;
    const limit = 25;
    const offset = page * limit;
    const diff = offset - limit;
    const skip = (diff > 0)
        ? diff
        : 0;

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

exports.update = async (req, res) => {
    const file = await File.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, // return new folder instead of the old one,
        runValidators: true
    }).exec();

    res.json(file);
};

exports.delete = async (req, res) => {
    const {id = ''} = req.params;

    await File.findOneAndRemove({_id: id});

    return res.json(id);
};
