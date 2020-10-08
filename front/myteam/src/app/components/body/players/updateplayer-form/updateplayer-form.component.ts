import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { TeamsService } from '../../../../services/teams.service';
import { PlayersService } from 'src/app/services/players.service';

//Models
import { ClubModel } from '../../../../models/club.model';
import { LeagueModel } from '../../../../models/league.model';
import { TeamModel } from '../../../../models/team.model';
import { PlayerModel } from 'src/app/models/player.model';


@Component({
  selector: 'app-updateplayer-form',
  templateUrl: './updateplayer-form.component.html',
  styleUrls: ['./updateplayer-form.component.css']
})
export class UpdateplayerFormComponent implements OnInit {

  formulario:FormGroup;
  leagues: LeagueModel[];
  clubs: ClubModel[];
  league_teams:LeagueModel[] = [];
  player:PlayerModel = new PlayerModel();

  constructor( private fb:FormBuilder, private LeaguesService:LeaguesService, private PlayersService:PlayersService, private route:ActivatedRoute, private ClubsService:ClubsService ) { 

    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;

    });

    this.ClubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.crearFormulario();

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.PlayersService.getPlayer(id).then((res:PlayerModel) => {
      this.player = res;
    });
  }

  crearFormulario(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', Validators.required],
      primary_position: ['', Validators.required],
      secondary_position: ['', ],
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

      this.PlayersService.updatePlayer(this.player).then(resp => {
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
