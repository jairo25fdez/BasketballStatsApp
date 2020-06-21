const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    last_name: String,
    password: String,
    email: String,
    phone: Number,
    rol: {type: String, enum: ['admin', 'coordinador', 'empleado']},
    club: String
});

mongoose.model('User', UserSchema);