import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Route } from '@angular/router';

//Models
import { UserModel } from '../../../../models/user.model';
import { ClubModel } from '../../../../models/club.model';

//Services
import { UsersService } from '../../../../services/users.service';
import { ClubsService } from '../../../../services/clubs.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user = new UserModel();
  form:FormGroup;
  clubs:ClubModel[];
  club_id:string;
  update:boolean;

  actual_club:ClubModel;

  constructor(private usersService:UsersService, private clubsService:ClubsService, private fb:FormBuilder, private route:ActivatedRoute,){ 
    this.clubsService.getClubs("?sort=name").then( (clubs:ClubModel[]) => {
      this.clubs = clubs;
    });

    const id = this.route.snapshot.paramMap.get('id');

    if(id != null){
      //Call to GET
      this.usersService.getUser(id).then((res:UserModel) => {
        this.user = res;

        this.clubsService.getClub(this.user.club).then( (club:ClubModel) => {
          this.actual_club = club;
        });
      });

      this.update = true;
      
    }
    else{
      this.update = false;
    }

    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      password: ['', ],
      email: ['', [Validators.required, Validators.email] ],
      rol: ['', [Validators.required] ],
      club: ['', ]
    });
  }

  get nameNoValid(){
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get lastnameNoValid(){
    return this.form.get('last_name').invalid && this.form.get('last_name').touched;
  }

  get passwordNoValid(){
    return this.form.get('password').invalid && this.form.get('password').touched;
  }

  get emailNoValid(){
    return this.form.get('email').invalid && this.form.get('email').touched;
  }

  get rolNoValid(){
    return this.form.get('rol').invalid && this.form.get('rol').touched;
  }

  get clubNoValid(){
    return this.form.get('club').invalid && this.form.get('club').touched;
  }

  saveUser(){

    if(this.form.invalid){

      return Object.values(this.form.controls).forEach( control => {
        control.markAsTouched();
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
      
      if(this.club_id != null){

        console.log("ENTRO");
        console.log("USER: "+JSON.stringify(this.user));

        this.clubsService.getClub(this.club_id).then( (club:ClubModel) => {
          this.user.club_img = club.img;

          this.usersService.updateUser(this.user).then( () => {
            Swal.fire({
              title: 'Usuario actualizado correctamente.',
              icon: 'success'
            });
          })
          .catch( (err:HttpErrorResponse) => {
            Swal.fire({
              title: 'Error al crear el usuario.',
              text: 'Compruebe que el email no está ya registrado.',
              icon: 'error'
            });
          });
  
        });

      }
      else{

        this.usersService.updateUser(this.user).then( () => {
          Swal.fire({
            title: 'Usuario actualizado correctamente.',
            icon: 'success'
          });
        })
        .catch( (err:HttpErrorResponse) => {
          Swal.fire({
            title: 'Error al actualizar el usuario.',
            icon: 'error'
          });
        });

      }

      
    }

  }

}
