import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';
import { GameModel } from '../../../../models/game.model';
import { Team_stats_gameModel } from '../../../../models/team_stats_game.model';
import { Player_stats_gameModel } from '../../../../models/player_stats_game.model';

//Services
import { GamesService } from '../../../../services/games.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';



@Component({
  selector: 'app-games-view',
  templateUrl: './games-view.component.html',
  styleUrls: ['./games-view.component.css']
})
export class GamesViewComponent implements OnInit {

  form:FormGroup;
  leagues: LeagueModel[];
  clubs:ClubModel[];
  teams:TeamModel[];
  players:PlayerModel[];
  games:GameModel[];

  constructor(private fb:FormBuilder, private gamesService:GamesService, private team_stats_gameService:Team_stats_gameService, private player_stats_gameService:Player_stats_gamesService){ 
    this.gamesService.getGames().then( (games:GameModel[]) => {

      this.games = games;

     var dt = new Date(games[1].date);

     console.log(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear());

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

  setLeague(){

  }

  getDate(game_index){
    let date = new Date(this.games[game_index].date);

    return (date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
  }

  deleteGame(game:GameModel){

    Swal.fire({
      title: 'Espere',
      text: 'Borrando partido...',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.gamesService.deleteGame(game._id).then(res => {

      this.player_stats_gameService.getPlayer_stats_games("?game_id="+game._id).then( (players_stats:Player_stats_gameModel[]) => {
        for(let player_stats of players_stats){
          this.player_stats_gameService.deletePlayer_stats_game(player_stats._id);
        }
      });

      this.team_stats_gameService.getTeams_stats_game("?game_id="+game._id).then( (teams_stats:Team_stats_gameModel[]) => {
        for(let team_stats of teams_stats){
          this.team_stats_gameService.deleteTeam_stats_game(team_stats._id);
        }
      });

      Swal.fire({
        title: 'Partido borrado correctamente.',
        icon: 'success'
      });

      //Reload Leagues info when delete is successful
      this.gamesService.getGames().then((games:GameModel[]) => {
        this.games = games;
      });

    })
    .catch( (err: HttpErrorResponse) => {
      console.error('Ann error occurred: ', err.error);
      Swal.fire({
        title: 'Error al borrar el partido.',
        icon: 'error'
      });
    });

  }

}
