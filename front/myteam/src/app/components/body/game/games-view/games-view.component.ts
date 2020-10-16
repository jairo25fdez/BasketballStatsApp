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

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { ClubsService } from 'src/app/services/clubs.service';
import { PlayersService } from 'src/app/services/players.service';
import { TeamsService } from 'src/app/services/teams.service';
import { GamesService } from '../../../../services/games.service';


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

  constructor(private fb:FormBuilder, private gamesService:GamesService){ 
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
