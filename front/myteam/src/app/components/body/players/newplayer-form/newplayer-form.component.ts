import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Servicios
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { PlayersService } from '../../../../services/players.service';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';


@Component({
  selector: 'app-newplayer-form',
  templateUrl: './newplayer-form.component.html',
  styleUrls: ['./newplayer-form.component.css']
})
export class NewplayerFormComponent implements OnInit {

  formulario:FormGroup;
  leagues: LeagueModel[];
  clubs: ClubModel[];
  player:PlayerModel = new PlayerModel();

  constructor( private fb:FormBuilder, private leaguesService:LeaguesService, private clubsService:ClubsService, private playersService:PlayersService ) { 

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', [Validators.required]],
      primary_position: ['', [Validators.required] ],
      secondary_position: ['', ],
      phone: [''],
      weight: [''],
      height: [''],
      number: [''],
      actual_team: [''],
      league: ['', [Validators.required]],
      club: ['', [Validators.required]],
      league_teams: ['']
    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get emailNoValid(){
    return this.formulario.get('email').invalid && this.formulario.get('email').touched;
  }

  get lastnameNoValid(){
    return this.formulario.get('last_name').invalid && this.formulario.get('last_name').touched;
  }

  get birthdateNoValid(){
    return this.formulario.get('birth_date').invalid && this.formulario.get('birth_date').touched;
  }

  get primarypositionNoValid(){
    return this.formulario.get('primary_position').invalid && this.formulario.get('primary_position').touched;
  }

  get secondarypositionNoValid(){
    return this.formulario.get('secondary_position').invalid && this.formulario.get('secondary_position').touched;
  }

  get phoneNoValid(){
    return this.formulario.get('phone').invalid && this.formulario.get('phone').touched;
  }

  setLeague(){ //CAMBIAR

  }

  guardar(){
    
    console.log("PLAYER: "+JSON.stringify(this.player));

    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
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

      this.playersService.createPlayer(this.player).then(resp => {
        //If the post success

        Swal.fire({
          title: 'Jugador creado correctamente.',
          icon: 'success'
        });

      })
      //If the post fails:
      .catch( (err: HttpErrorResponse) => {
        console.error('Ann error occurred: ', err.error);
        Swal.fire({
          title: 'Error al crear el jugador.',
          text: 'Compruebe que no existe un jugador con el mismo nombre y fecha de nacimiento.',
          icon: 'error'
        });
      });

    }

  }

}
