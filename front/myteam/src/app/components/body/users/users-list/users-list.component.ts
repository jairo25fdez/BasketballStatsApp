import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

//Services
import { UsersService } from '../../../../services/users.service';

//Models
import { UserModel } from '../../../../models/user.model';

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

}
