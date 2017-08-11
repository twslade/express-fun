const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    req.flash('success', `Store was successfully updated <strong>${store.name}</strong><a`);
    res.redirect(`/store/${store._id}/edit`);
};