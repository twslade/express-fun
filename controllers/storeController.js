const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isImg = file.mimetype.startsWith('image/');
        if(isImg){
            next(null, true);
        } else {
            next({message : 'That filetype is not allowed!'}, false);
        }
    }
};

exports.upload = multer(multerOptions).single('image');
exports.resize = async (req, res, next) => {
  //Check if some files need to be resized...
  if(!req.file){
      next();
      return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `${uuid.v4()}.${extension}`;

  //Resize image and write to filesystem
  const image = await jimp.read(req.file.buffer);
  await image.resize(800, jimp.AUTO);
  await image.write(`./public/uploads/${req.body.image}`);

  next();
};


exports.homePage = (req, res) => {
  res.render('index');
};

exports.add = (req, res) => {
  res.render('editStore', {title : 'Add Store'})
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();

    req.flash('success', `Store was successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store._id}/edit`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores});
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id});
  res.render('editStore', {title : 'Edit Store', store});
};

exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    req.flash('success', `Store was successfully updated <strong>${store.name}</strong><a`);
    res.redirect(`/store/${store._id}/edit`);
};

exports.viewStore = async (req, res) => {
    const store = await Store.findOne({slug: req.params.slug});
    if(!store) return next();
    res.render('viewStore', {store});
};