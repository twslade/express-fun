const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please specify a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },

});

storeSchema.pre('save', function(next){
    if(this.isModified('name')){
        this.slug = slug(this.name);
    }
    next();
    return;

    //@todo: Make unique

});

module.exports = mongoose.model('Store', storeSchema);
