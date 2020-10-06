import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueModel } from '../../../../models/league.model';

//Servicios
import { LeaguesService } from '../../../../services/leagues.service';
import { ImagesService } from '../../../../services/images.service';

//Notificaciones
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ImageModel } from 'src/app/models/image.model';

@Component({
  selector: 'app-newleague-form',
  templateUrl: './newleague-form.component.html',
  styleUrls: ['./newleague-form.component.css']
})
export class NewleagueFormComponent implements OnInit {

  formulario: FormGroup;
  league = new LeagueModel();
  update:boolean = false;
  selectedFile:File = null;


  constructor(private fb:FormBuilder, private LeaguesService:LeaguesService, private ImagesService:ImagesService, private route:ActivatedRoute, private http: HttpClient) { 
    this.crearFormulario();

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id != null){
      //Call to GET
      this.LeaguesService.getLeague(id).then((res:LeagueModel) => {
        this.league = res;
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
      location: ['', ],
      quarters_num: ['', [Validators.required]],
      quarter_length: ['', [Validators.required]],
      overtime_length: ['', [Validators.required]],
      shot_clock: [''],
      max_personal_fouls: [''],
      max_team_fouls: ['', [Validators.required]]

    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get locationNoValid(){
    return this.formulario.get('location').invalid && this.formulario.get('location').touched;
  }

  get quartersnumNoValid(){
    return this.formulario.get('quarters_num').invalid && this.formulario.get('quarters_num').touched;
  }

  get quarterlengthNoValid(){
    return this.formulario.get('quarter_length').invalid && this.formulario.get('quarter_length').touched;
  }

  get overtimelengthNoValid(){
    return this.formulario.get('overtime_length').invalid && this.formulario.get('overtime_length').touched;
  }

  get teamfoulsNoValid(){
    return this.formulario.get('max_team_fouls').invalid && this.formulario.get('max_team_fouls').touched;
  }

  get personalfoulsNoValid(){
    return this.formulario.get('max_personal_fouls').invalid && this.formulario.get('max_personal_fouls').touched;
  }

  get shotclockNoValid(){
    return this.formulario.get('shot_clock').invalid && this.formulario.get('shot_clock').touched;
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
        this.league.img = res.image_url;


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
  
        this.LeaguesService.updateLeague(this.league).then( resp => {
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
  
        this.LeaguesService.createLeague(this.league).then(resp => {
          //If the post success
  
          Swal.fire({
            title: 'Liga creada correctamente.',
            icon: 'success'
          });
  
        })
        //If the post fails:
        .catch( (err: HttpErrorResponse) => {
          console.error('Ann error occurred: ', err.error);
          Swal.fire({
            title: 'Error al crear la liga.',
            text: 'Compruebe que no existe una liga con el mismo nombre.',
            icon: 'error'
          });
        });
      }

      

    }

  }


}
