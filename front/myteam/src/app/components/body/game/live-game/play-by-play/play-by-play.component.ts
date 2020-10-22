import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

//Models
import { PlayModel } from '../../../../../models/play.model';
import { TeamModel } from '../../../../../models/team.model';
import { Team_stats_gameModel } from 'src/app/models/team_stats_game.model';
import { Player_stats_gameModel } from 'src/app/models/player_stats_game.model';
import { GameModel } from '../../../../../models/game.model';

//Services
import { PlaysService } from 'src/app/services/plays.service';
import { GamesService } from 'src/app/services/games.service';
import { Team_stats_gameService } from '../../../../../services/team_stats_game.service';
import { Player_stats_gamesService } from '../../../../../services/player_stats_game.service';





@Component({
  selector: 'app-play-by-play',
  templateUrl: './play-by-play.component.html',
  styleUrls: ['./play-by-play.component.css']
})
export class PlayByPlayComponent implements OnInit {

 plays:PlayModel[] = [];
 game_id = "";
 game:GameModel;
 home_team_id:string;
 visitor_team_id:string;

 home_team_stats:Team_stats_gameModel;
 visitor_team_stats:Team_stats_gameModel;

  constructor(private playsService:PlaysService, private gameService:GamesService, private player_stats_gameService:Player_stats_gamesService, private team_stats_gameService:Team_stats_gameService, private router:Router) { 

    this.game_id = router.url.split('/')[2].toString();  //Game ID
    
    this.gameService.getGame(this.game_id).then( (game:GameModel) => {
      this.game = game;
      this.home_team_id = game.home_team.team_id;
      this.visitor_team_id = game.visitor_team.team_id;
    });

    this.team_stats_gameService.getTeams_stats_game("?game_id="+this.game_id).then( (teams_stats:Team_stats_gameModel[]) => {
      if(teams_stats[0].team_id == this.home_team_id){
        this.home_team_stats = teams_stats[0];
        this.visitor_team_stats = teams_stats[1];
      }
      else{
        this.home_team_stats = teams_stats[1];
        this.visitor_team_stats = teams_stats[0];
      }
    });

  }

  ngOnInit(): void {

    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
    });
    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
    });

  }

  deletePlay(play){
    let play_index = this.plays.indexOf(play);
    let shot_points = 0;
    let team = -1;
    let shot_position = this.plays[play_index].shot_position;
    let player_stats:Player_stats_gameModel;
    
    this.player_stats_gameService.getPlayer_stats_games("?player_id="+this.plays[play_index].player.player_id+"&game_id="+this.game_id).then( (players_stats:Player_stats_gameModel[]) => {
      player_stats = players_stats[0];

      //Todas las jugadas posteriores a esta deben ser actualizadas, así como el marcador actual, en caso de ser una canasta
    if( this.plays[play_index].type == "shot" ){
      //If they play that we want to delete if a made shot we need to update the plays that were created after it
      if( (this.plays[play_index].shot_made == true) ){

        //Check if the shot was a ft or fg and if it was a 2 points shot or 3 points shot
        if( this.plays[play_index].shot_type == "ft" ){
          shot_points = 1;
        }
        else{
          if( this.plays[play_index].shot_position == "lc3" || this.plays[play_index].shot_position == "le3" || this.plays[play_index].shot_position == "c3" || this.plays[play_index].shot_position == "re3" || this.plays[play_index].shot_position == "rc3"){
            shot_points = 3;
          }

          else{
            shot_points = 2;
          }
        }

        if(this.plays[play_index].team.team_id == this.home_team_id){
          team = 0;

          this.game.home_team_score -= shot_points;
          this.home_team_stats.points -= shot_points;
          this.home_team_stats.shots_list[shot_position].made--;
          this.home_team_stats.shots_list[shot_position].attempted--;
        }
        else{
          team = 1;

          this.game.visitor_team_score -= shot_points;
          this.visitor_team_stats.points -= shot_points;
          this.visitor_team_stats.shots_list[shot_position].made--;
          this.visitor_team_stats.shots_list[shot_position].attempted--;
        }

        //If the player's team is the home team
        if(team == 0){
          for(let cont = play_index-1; cont >= 0; cont--){
            this.plays[cont].home_team_score -= shot_points;
            this.playsService.updatePlay(this.plays[cont]).catch( (err:HttpErrorResponse) => {
              Swal.fire({
                title: 'Error al actualizar la jugada.',
                icon: 'error'
              });
            });
          }
        }
        //If the player's team is the visitor team
        else{
          for(let cont = play_index-1; cont >= 0; cont--){
            this.plays[cont].visitor_team_score -= shot_points;
            this.playsService.updatePlay(this.plays[cont]).catch( (err:HttpErrorResponse) => {
              Swal.fire({
                title: 'Error al actualizar la jugada.',
                icon: 'error'
              });
            });
          }
        }

        

      }

    }

    //Delete the play in the server and update the actual plays
    this.playsService.deletePlay(play._id).then( () => {
      this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
        this.plays = plays;
      });
    })
    .catch( (err:HttpErrorResponse) => {
      Swal.fire({
        title: 'Error al borrar la jugada.',
        icon: 'error'
      });
    });


    });

    
    
    

  }


}
