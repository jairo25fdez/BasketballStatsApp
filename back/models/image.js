const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var imageSchema = new mongoose.Schema({  
    img: String 
}); 
  
module.exports = new mongoose.model('Image', imageSchema);