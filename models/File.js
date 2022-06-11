const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name:{type: String, required:true},
    extension: {type: String, required:false},
    type: {type: String, required:true},
    path:{type: String, required:true},
    size: {type: Number, required:true},
    date: {type: Date, default: Date.now()},
    shared: {type: Boolean, default: false, required:true},
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('File', schema)