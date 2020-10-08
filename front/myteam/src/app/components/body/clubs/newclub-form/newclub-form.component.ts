import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClubModel } from 'src/app/models/club.model';

import { ImagesService } from '../../../../services/images.service';
import { ClubsService } from '../../../../services/clubs.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-newclub-form',
  templateUrl: './newclub-form.component.html',
  styleUrls: ['./newclub-form.component.css']
})
export class NewclubFormComponent implements OnInit {

  formulario: FormGroup;
  club = new ClubModel();
  update:boolean = false;
  selectedFile:File = null;
  exists_img:boolean = false; 

  constructor(private fb:FormBuilder, private route:ActivatedRoute, private ImagesService:ImagesService, private ClubsService:ClubsService) {
    this.crearFormulario();

   }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id != null){
      //Call to GET
      this.ClubsService.getClub(id).then((res:ClubModel) => {
        this.club = res;
        if('img' in res){
          this.exists_img = true;
        }
        else{
          this.exists_img = false;
        }
      });
      this.update = true;
      
    }
    else{
      this.update = false;
    }
  }


  crearFormulario(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      img: [''],
      acronym: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)] ],
      country: ['', [Validators.required] ],
      city: ['', [Validators.required] ],
      location: ['', [Validators.required] ],
      stadium: ['', [Validators.required] ],
      phone: ['', ],
      email: ['', Validators.email]

    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get acronymNoValid(){
    return this.formulario.get('acronym').invalid && this.formulario.get('acronym').touched;
  }

  get countryNoValid(){
    return this.formulario.get('country').invalid && this.formulario.get('country').touched;
  }

  get cityNoValid(){
    return this.formulario.get('city').invalid && this.formulario.get('city').touched;
  }

  get locationNoValid(){
    return this.formulario.get('location').invalid && this.formulario.get('location').touched;
  }

  get stadiumNoValid(){
    return this.formulario.get('stadium').invalid && this.formulario.get('stadium').touched;
  }

  get emailNoValid(){
    return this.formulario.get('email').invalid && this.formulario.get('email').touched;
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

  uploadImage(){
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);

    Swal.fire({
      title: 'Espere',
      text: 'Guardando imagen',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.ImagesService.uploadImage(fd).then((res:any) => {
      
      if(res.status == 200){
        //Guardo la url en la propiedad correspondiente
        this.club.img = res.image_url;


        Swal.fire({
          title: 'Imagen subida correctamente.',
          icon: 'success'
        });
      }
      else{
        Swal.fire({
          title: 'Error al subir la imagen.',
          icon: 'error'
        });
      }
    });

  }

  guardar(){


    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{

      

      if(this.update){

        Swal.fire({
          title: 'Espere',
          text: 'Guardando información',
          icon: 'info',
          allowOutsideClick: false
        });
  
        Swal.showLoading();
  
        this.ClubsService.updateClub(this.club).then( resp => {
          //If the put success
  
          Swal.fire({
            title: 'Liga editada correctamente.',
            icon: 'success'
          });
  
        })
        //If the update fails:
        .catch( (err: HttpErrorResponse) => {
          console.error('Ann error occurred: ', err.error);
          console.log(err);
          Swal.fire({
            title: 'Error al editar la liga.',
            icon: 'error'
          });
        });

      }
      else{

        Swal.fire({
          title: 'Espere',
          text: 'Guardando información',
          icon: 'info',
          allowOutsideClick: false
        });
  
        Swal.showLoading();
  
        this.ClubsService.createClub(this.club).then(resp => {
          //If the post success
  
          Swal.fire({
            title: 'Club creado correctamente.',
            icon: 'success'
          });
  
        })
        //If the post fails:
        .catch( (err: HttpErrorResponse) => {
          console.error('Ann error occurred: ', err.error);
          Swal.fire({
            title: 'Error al crear el club.',
            text: 'Compruebe que no existe un club con el mismo nombre en la misma ciudad.',
            icon: 'error'
          });
        });
      }

      

    }

  }

}
