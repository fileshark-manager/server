const mongoose = require('mongoose');
const File = mongoose.model('File');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const promisify = require('es6-promisify');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const files = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'files.json'), 'utf-8'));

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (isPhoto) {
            next(null, true);
        } else {
            next({message: 'That filetype is not allowed!'}, false);
        }
    },
    limits: {
        files: 1,
        fileSize: 100000
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

    const file = await jimp.read(req.file.buffer);

    await file.write(`./public/uploads/${fileName}`);

    const getBuffer = promisify(file.getBuffer, file);

    const buffer = await getBuffer(jimp.AUTO);
    const size = `${parseInt(buffer.length / 1000)} KB`;

    req.body.title = req.file.originalname;
    req.body.filename = req.file.originalname;
    req.body.url = `/uploads/${fileName}`;
    req.body.dimensions = `${file.bitmap.width}x${file.bitmap.height}`;
    req.body.size = size;

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

exports.bang = async (req, res, next) => {
    await File.remove();

    rimraf('./public/uploads/*', function () {
        next();
    });
};

exports.loadSample = async (req, res) => {
    await File.insertMany(files);

    fs.copyFileSync('./data/uploads/cfb789e0-42fa-4b56-9bb4-cf5f814a12cd.jpeg', './public/uploads/cfb789e0-42fa-4b56-9bb4-cf5f814a12cd.jpeg');
    fs.copyFileSync('./data/uploads/ec643ee8-3ef7-4da2-850c-8fbcace680e1.jpeg', './public/uploads/ec643ee8-3ef7-4da2-850c-8fbcace680e1.jpeg');

    res.send('💥');
};

