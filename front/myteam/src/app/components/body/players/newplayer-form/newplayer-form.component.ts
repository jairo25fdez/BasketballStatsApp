import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Servicios
import { LeaguesService } from '../../../../services/leagues.service';
import { LeagueModel } from '../../../../models/league.model';

@Component({
  selector: 'app-newplayer-form',
  templateUrl: './newplayer-form.component.html',
  styleUrls: ['./newplayer-form.component.css']
})
export class NewplayerFormComponent implements OnInit {

  formulario:FormGroup;
  leagues: LeagueModel[];
  league_teams:any[] = [];

  constructor( private fb:FormBuilder, private leaguesService:LeaguesService ) { 

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;

    });

    this.crearFormulario();

  }

  ngOnInit(): void {
  }

  crearFormulario(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', Validators.required],
      phone: [''],
      weight: [''],
      height: [''],
      number: [''],
      actual_team: [''],
      leagues: [''],
      league_teams: ['']
    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get lastnameNoValid(){
    return this.formulario.get('last_name').invalid && this.formulario.get('last_name').touched;
  }

  get birthdateNoValid(){
    return this.formulario.get('birth_date').invalid && this.formulario.get('birth_date').touched;
  }

  setLeague(){ //CAMBIAR

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
