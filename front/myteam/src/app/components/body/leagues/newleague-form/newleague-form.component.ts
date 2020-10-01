import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newleague-form',
  templateUrl: './newleague-form.component.html',
  styleUrls: ['./newleague-form.component.css']
})
export class NewleagueFormComponent implements OnInit {

  formulario: FormGroup;


  constructor(private fb:FormBuilder) { 
    this.crearFormulario();

  }

  ngOnInit(): void {
  }


  crearFormulario(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      location: ['', ],
      quarters_num: ['', [Validators.required]],
      quarter_length: ['', [Validators.required]],
      overtime_length: ['', [Validators.required]],
      shot_clock: [''],
      max_personal_fouls: [''],
      max_team_fouls: ['', [Validators.required]],

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

  guardar(){
    console.log(this.formulario);

    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{
      /* Llamada a POST */
    }

  }

}
