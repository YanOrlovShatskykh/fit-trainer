const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    measurement: { type: String, required: true },
    order: { type: Number },
    user: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Excercise', Schema);