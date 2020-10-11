import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { GameModel } from '../../../../models/game.model';
import { PlayerModel } from '../../../../models/player.model';
import { TeamModel } from 'src/app/models/team.model';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { TeamsService } from '../../../../services/teams.service';
import { PlayersService } from '../../../../services/players.service';
import { GamesService } from '../../../../services/games.service';



@Component({
  selector: 'app-newgame-form',
  templateUrl: './newgame-form.component.html',
  styleUrls: ['./newgame-form.component.css']
})
export class NewgameFormComponent implements OnInit {

  form:FormGroup;
  
  league_selected = false;

  game:GameModel = new GameModel();
  local_leagues:LeagueModel[];
  visitor_leagues:LeagueModel[];
  clubs:ClubModel[];
  teams:TeamModel[];

  selected_home_players = 0;
  selected_home_players_5i = 0;
  selected_visitor_players = 0;
  selected_visitor_players_5i = 0;

  //home_team_players:PlayerModel[];
  //visitor_team_players:PlayerModel[];
  home_team_players = [];
  visitor_team_players = [];


  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private teamsService:TeamsService, private gamesService:GamesService, private clubsService:ClubsService, private router:Router) {

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.local_leagues = res;
      this.visitor_leagues = res;
    });

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

   }

  ngOnInit(): void {
  }

  createForm(){

    this.form = this.fb.group({
      game_league: ['',  ],
      game_date: ['', ],
      game_season: ['', Validators.required],
      home_club: ['', Validators.required],
      visitor_club: ['', Validators.required]
      
    });

  }

  checkHomePlayers(event, checkBox) {

    if(checkBox == "home_player_5i"){
      if(event.target.checked === true){
        if(this.selected_home_players_5i < 5){
          this.selected_home_players_5i++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_home_players_5i>0){
        this.selected_home_players_5i--;
      }
    }
    else{
      if(event.target.checked === true){
        if(this.selected_home_players < 5){
          this.selected_home_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_home_players>0){
        this.selected_home_players--;
      }
    }

    
  }

  checkVisitorPlayers(event, checkBox) {

    if(checkBox == "visitor_player_5i"){
      if(event.target.checked === true){
        if(this.selected_visitor_players_5i < 5){
          this.selected_visitor_players_5i++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_visitor_players_5i>0){
        this.selected_visitor_players_5i--;
      }
    }
    else{
      if(event.target.checked === true){
        if(this.selected_visitor_players < 5){
          this.selected_visitor_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_visitor_players>0){
        this.selected_visitor_players--;
      }
    }

    
  }

  setGameLeague(league_index){

    if(league_index != "friendly_game"){

      this.game.league = {
        league_id: this.leagues[league_index]._id,
        league_name: this.leagues[league_index].name
      }

      this.league_selected = true;

      //Load the teams that belong to the selected league.
      this.setTeams(this.game.league.league_id);

    }
    else{
      this.league_selected = false;
    }
    

  }

  setLocalClub(club_index:number){

  }

  setTeams(league_id){
    //Hago petición pidiendo los teams que tienen league_id = al que quiero
    this.teamsService.getTeams("?league.league_id="+league_id).then((res:TeamModel[]) => {
      this.teams = res;
    });

  }

  setLocalTeam(team_index:number){

    this.home_team_players = this.teams[team_index].roster;
    console.log("PLAYERS: "+JSON.stringify(this.home_team_players) );

  }

  setVisitorTeam(team_index:number){

    this.visitor_team_players = this.teams[team_index].roster;

  }


  guardar(){

    //Valido el formulario
      //Si es valido hago post, guardo el ID y me muevo al partido
      //this.router.navigateByUrl('/live-game');
      //Si no es valido me quedo

      console.log(JSON.stringify(this.game));

      /*


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

      this.gamesService.createGame(this.game).then(resp => {
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
    */

  }

}
