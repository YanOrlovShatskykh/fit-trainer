const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    repeats: { type: Number, required: true },
    measurement: { type: Number, required: true },
    order: { type: Number },
    user: { type: Types.ObjectId, ref: 'User' },
    exercise: { type: Types.ObjectId, ref: 'Exercise' },
    date: [{}]// ????
});

module.exports = model('Workout', schema);