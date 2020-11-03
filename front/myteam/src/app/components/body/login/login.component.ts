import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

//Models
import { UserModel } from '../../../models/user.model';
import { AuthModel } from 'src/app/models/auth.model';

//Services
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  user:UserModel;

  constructor(private fb:FormBuilder, private loginService:LoginService, private router:Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.user = new UserModel();
  }

  createForm(){

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [Validators.required]],
    });

  }

  get emailNoValid(){
    return this.form.get('email').invalid && this.form.get('email').touched;
  }

  get passwordNoValid(){
    return this.form.get('password').invalid && this.form.get('password').touched;
  }

  login(){

    if(this.form.invalid){

      return Object.values(this.form.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{
      Swal.fire({
        title: 'Espere',
        text: 'Comprobando usuario.',
        icon: 'info',
        allowOutsideClick: false
      });

      Swal.showLoading();

      this.loginService.checkLogin(this.user).then( (auth:AuthModel) => {

        Swal.close();

        this.loginService.saveToken(auth.token);

        this.router.navigate(['home']);

      })
      .catch( (err: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al validar usuario.',
          text: 'El email o contraseña no son correctos.',
          icon: 'error'
        });
      });
      
    }

  }

}
