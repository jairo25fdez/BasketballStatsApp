const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    last_name: String,
    password: {type: String, required: true}, 
    email: {type: String, unique: true, required: true},
    rol: {type: String, enum: ['admin', 'coordinator', 'employee']},
    club: {type: Schema.Types.ObjectId, ref: 'Club'}
});

userSchema.index( {email:1 }, { unique: true } );

userSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('User', userSchema);