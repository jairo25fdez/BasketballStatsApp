

const { resolve } = require('path');
const league = require('../models/image');

module.exports = function (app){
    const multer = require('multer'); 
    const cloudinary = require('cloudinary').v2;
    const fs = require('fs')

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    const BASE_API_URL = "/api/v1";

    

    //MULTER
    const storage = multer.diskStorage({ 
        destination: (req, file, cb) => { 
            cb(null, './upload/temp') 
        }, 
        filename: (req, file, cb) => { 
            cb(null, file.originalname ) 
        } 
    }); 
      

    const upload = multer({ 
        storage: storage
    });




    //GET all images
    app.get(BASE_API_URL+'/images', (req, res) => { 
        imgModel.find({}, (err, items) => { 
            if (err) { 
                console.log(err); 
            } 
            else { 
                res.json({ items: items }); 
            } 
        }); 
    });

    //POST image in Cloudinary
    app.post(BASE_API_URL+'/images', upload.single('image'),(request, response) => { 

        const file_path = request.file.path;
        
        cloudinary.uploader.upload(file_path)
        .then( (res) => {
            //Si acierto obtengo la URL de la imagen y la guardo en Mongo
            const image_url = res.secure_url;  
            response.sendStatus(200);
        })
        .catch( (err) => {
            console.log("ERROR: "+JSON.stringify(err));
            response.sendStatus(500);
        });

        try {
            fs.unlinkSync(file_path)
        }
        catch(err) {
            console.error("Couldnt delete the img.");
        }
        

    });

}
  
