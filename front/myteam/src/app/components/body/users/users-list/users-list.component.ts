import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

//Services
import { UsersService } from '../../../../services/users.service';

//Models
import { UserModel } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users:UserModel[];
  form:FormGroup;

  constructor(private usersService:UsersService, private fb:FormBuilder){

    this.usersService.getUsers().then( (users:UserModel[]) => {
      this.users = users;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){

    this.form = this.fb.group({
      leagues: [''],
      clubs: [''],
      teams: ['']
    });

  }


  deleteUser(user:UserModel){
    this.usersService.deleteUser(user._id).then( () => {

      this.usersService.getUsers().then( (users:UserModel[]) => {
        this.users = users;
      });

      Swal.fire({
        title: 'Usuario borrado correctamente.',
        icon: 'success'
      });
      
    })
    .catch( (err:HttpErrorResponse) => {
      Swal.fire({
        title: 'Error al borrar el usuario.',
        icon: 'error'
      });
    });
  }

}
