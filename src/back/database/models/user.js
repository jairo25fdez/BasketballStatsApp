const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    displayName: {type: String, required: true},
    avatar: String,
    name: String,
    last_name: String,
    password: {type: String, required: true}, //El select: false hace que por defecto al hacer un GET no nos devuelva la password.
    email: {type: String, unique: true, required: true},
    phone: Number,
    rol: {type: String, enum: ['admin', 'coordinator', 'employee']},
    club: {type: Schema.Types.ObjectId, ref: 'Club'}
});

userSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) =>{
            if(err){
                return err;
            }

            user.password = hash;
            next();
        });

    });

});



/*
userSchema.methods.gravatar = function(){
    if(!this.email){
        return 'https://gravatar.com/avatar/?s=200'
    }
    
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/'+md5+'?s=200&d=retro';

}
*/
module.exports = mongoose.model('User', userSchema);