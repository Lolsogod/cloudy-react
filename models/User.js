const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email:{type: String, required:true, unique: true},
    password:{type: String, required: true},
    space: {type: Number, required: true, default: 104857600},
    files: [{type: Types.ObjectId, ref: 'File'}]
})

module.exports = model('User', schema)