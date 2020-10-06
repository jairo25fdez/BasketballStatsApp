import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageModel } from '../models/image.model';

@Injectable()
export class ImagesService{

    private imagesUrl = 'http://localhost:8000/api/v1/images';

    constructor(private http: HttpClient){
        console.log("Images services ready");
    }

    getImages(){
        return this.http.get(this.imagesUrl).toPromise();
    }

    uploadImage(image){
        
        return this.http.post(this.imagesUrl, image, {responseType: 'text'}).toPromise();
    }

    
}