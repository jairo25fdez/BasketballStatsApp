import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//Models
import { UserModel } from '../../../../models/user.model';
import { ClubModel } from '../../../../models/club.model';

//Services
import { UsersService } from '../../../../services/users.service';
import { ClubsService } from '../../../../services/clubs.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newuser-form',
  templateUrl: './newuser-form.component.html',
  styleUrls: ['./newuser-form.component.css']
})
export class NewuserFormComponent implements OnInit {

  user = new UserModel();
  form:FormGroup;
  clubs:ClubModel[];

  constructor(private usersService:UsersService, private clubsService:ClubsService, private fb:FormBuilder){ 
    this.clubsService.getClubs("?sort=name").then( (clubs:ClubModel[]) => {
      this.clubs = clubs;
    });

    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      password: ['', [Validators.required] ],
      email: ['', [Validators.required, Validators.email] ],
      rol: ['', [Validators.required] ],
      club: ['', [Validators.required] ]
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

  setClub(){

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
      
      this.clubsService.getClub(this.user.club).then( (club:ClubModel) => {
        this.user.club_img = club.img;

        this.usersService.createUser(this.user).then( () => {
          Swal.fire({
            title: 'Equipo creado correctamente.',
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

  }

}
