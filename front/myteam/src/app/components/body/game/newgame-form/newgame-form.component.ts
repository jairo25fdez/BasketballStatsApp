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
  local_club_selected = false;
  visitor_club_selected = false;

  game:GameModel = new GameModel();
  clubs:ClubModel[];
  teams:TeamModel[];
  leagues:LeagueModel[];

  local_club_teams:TeamModel[] = [];
  visitor_club_teams:TeamModel[] = [];
  

  home_team_players = [];
  visitor_team_players = [];

  selected_home_players = 0;
  selected_home_players_5i = 0;
  selected_visitor_players = 0;
  selected_visitor_players_5i = 0;

  reset_local_select = true;


  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private teamsService:TeamsService, private gamesService:GamesService, private clubsService:ClubsService, private router:Router) {

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

    this.form = this.fb.group({
      game_league: ['',  ],
      game_date: ['', Validators.required],
      game_season: ['', Validators.required],
      home_club: ['', ],
      home_team_league: ['', ],

      visitor_club: ['', ],
      visitor_team_league: ['', ]
      
    });

  }

  get gamedateNoValid(){
    return this.form.get('game_date').invalid && this.form.get('game_date').touched;
  }

  get gameseasonNoValid(){
    return this.form.get('game_season').invalid && this.form.get('game_season').touched;
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
      };

      this.league_selected = true;
      this.local_club_selected = false;
      this.visitor_club_selected = false;

      //Load the teams that belong to the selected league.
      this.setTeams(this.game.league.league_id);

    }
    else{
      this.league_selected = false;
    }

    //Reset the values everytime we change the league.
    this.local_club_teams = [];
    this.visitor_club_teams = [];
  
    this.home_team_players = [];
    this.visitor_team_players = [];

    
    

  }

  setLocalClub(club_index:number){
    this.local_club_selected = true;

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.local_club_teams = res;
      console.log("CAMBIO CLUB LOCALES");
    });

    this.home_team_players = [];

    this.form.get('home_team_league').setValue('');

  }

  setVisitorClub(club_index:number){
    this.visitor_club_selected = true;

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.visitor_club_teams = res;
    });

    this.visitor_team_players = [];

    this.form.get('visitor_team_league').setValue('');

  }

  selectLocalTeam(team_index:string){

    this.game.home_team = {
      club_id: this.local_club_teams[team_index].club.club_id,
      club_name: this.local_club_teams[team_index].club.club_name,
      club_img: this.local_club_teams[team_index].club.club_img,
      team_id: this.local_club_teams[team_index]._id
    } 

    this.home_team_players = this.local_club_teams[team_index].roster;

  }

  selectVisitorTeam(team_index:string){

    this.game.visitor_team = {
      club_id: this.visitor_club_teams[team_index].club.club_id,
      club_name: this.visitor_club_teams[team_index].club.club_name,
      club_img: this.visitor_club_teams[team_index].club.club_img,
      team_id: this.visitor_club_teams[team_index]._id
    }

    this.visitor_team_players = this.visitor_club_teams[team_index].roster;

  }

  setTeams(league_id){
    //Hago petición pidiendo los teams que tienen league_id = al que quiero
    this.teamsService.getTeams("?league.league_id="+league_id).then((res:TeamModel[]) => {
      this.teams = res;
    });

  }

  setLocalTeam(team_index:number){

    this.game.home_team = {
      club_id: this.teams[team_index].club.club_id,
      club_name: this.teams[team_index].club.club_name,
      club_img: this.teams[team_index].club.club_img,
      team_id: this.teams[team_index]._id
    } 

    this.home_team_players = this.teams[team_index].roster;

  }

  setVisitorTeam(team_index:number){

    this.game.visitor_team = {
      club_id: this.teams[team_index].club.club_id,
      club_name: this.teams[team_index].club.club_name,
      club_img: this.teams[team_index].club.club_img,
      team_id: this.teams[team_index]._id
    }

    this.visitor_team_players = this.teams[team_index].roster;

  }


  guardar(){

    //Valido el formulario
      //Si es valido hago post, guardo el ID y me muevo al partido
      //this.router.navigateByUrl('/live-game');
      //Si no es valido me quedo

      console.log(JSON.stringify(this.game));

      


    if(this.form.invalid){

      return Object.values(this.form.controls).forEach( control => {
        control.markAsTouched();
      });

    }/*
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
