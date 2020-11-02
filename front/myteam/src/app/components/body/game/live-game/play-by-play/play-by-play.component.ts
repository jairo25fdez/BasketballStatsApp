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

    this.game_id = router.url.split('/')[3].toString();  //Game ID
    
    

  }

  ngOnInit(): void {

    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=-period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
    });
    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=-period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
    });

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

  deletePlay(play:PlayModel){
    let play_index = this.plays.indexOf(play);
    let shot_points = 0;
    let team = -1;
    let shot_position = this.plays[play_index].shot_position;
    let player_stats:Player_stats_gameModel;
    
    this.player_stats_gameService.getPlayer_stats_games("?player_id="+this.plays[play_index].player.player_id+"&game_id="+this.game_id).then( (players_stats:Player_stats_gameModel[]) => {
      player_stats = players_stats[0];

      if( this.plays[play_index].type == "shot" ){

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

        //If the play that we want to delete is a made shot we need to update the plays that were created after it
        if( (this.plays[play_index].shot_made == true) ){

          if(this.plays[play_index].team.team_id == this.home_team_id){
            team = 0;

            //Game home team score
            this.game.home_team_score -= shot_points;
            //Home team stats
            this.home_team_stats.points -= shot_points;

            if(shot_points != 1){
              this.home_team_stats.shots_list[shot_position].made--;
              this.home_team_stats.shots_list[shot_position].attempted--;
            }
            //Player stats
            player_stats.points -= shot_points;
            if(shot_points != 1){
              player_stats.shots_list[shot_position].made--;
              player_stats.shots_list[shot_position].attempted--;
            }

            if(shot_points == 1){
              this.home_team_stats.t1_made--;
              this.home_team_stats.t1_attempted--;
              this.home_team_stats.t1_percentage = this.home_team_stats.t1_made / this.home_team_stats.t1_attempted;

              player_stats.t1_made--;
              player_stats.t1_attempted--;
              player_stats.t1_percentage = player_stats.t1_made / player_stats.t1_attempted;
            }
            else{
              if(shot_points == 2){
                this.home_team_stats.t2_made--;
                this.home_team_stats.t2_attempted--;
                this.home_team_stats.t2_percentage = this.home_team_stats.t2_made / this.home_team_stats.t2_attempted;

                player_stats.t2_made--;
                player_stats.t2_attempted--;
                player_stats.t2_percentage = player_stats.t2_made / player_stats.t2_attempted;
              }
              else{
                this.home_team_stats.t3_made--;
                this.home_team_stats.t3_attempted--;
                this.home_team_stats.t3_percentage = this.home_team_stats.t3_made / this.home_team_stats.t3_attempted;

                player_stats.t3_made--;
                player_stats.t3_attempted--;
                player_stats.t3_percentage = player_stats.t3_made / player_stats.t3_attempted;
              }
            }

          }
          else{
            team = 1;
            console.log("EQUIPO VISITANTE");
            console.log("GAME.VISITOR_TEAM_SCORE: "+this.game.visitor_team_score);
            //Game visitor team score
            this.game.visitor_team_score -= shot_points;
            //visitor team stats
            this.visitor_team_stats.points -= shot_points;
            this.visitor_team_stats.shots_list[shot_position].made--;
            this.visitor_team_stats.shots_list[shot_position].attempted--;
            //Player stats
            player_stats.points -= shot_points;
            player_stats.shots_list[shot_position].made--;
            player_stats.shots_list[shot_position].attempted--;

            if(shot_points == 1){
              this.visitor_team_stats.t1_made--;
              this.visitor_team_stats.t1_attempted--;
              this.visitor_team_stats.t1_percentage = this.visitor_team_stats.t1_made / this.visitor_team_stats.t1_attempted;

              player_stats.t1_made--;
              player_stats.t1_attempted--;
              player_stats.t1_percentage = player_stats.t1_made / player_stats.t1_attempted;
            }
            else{
              if(shot_points == 2){
                this.visitor_team_stats.t2_made--;
                this.visitor_team_stats.t2_attempted--;
                this.visitor_team_stats.t2_percentage = this.visitor_team_stats.t2_made / this.visitor_team_stats.t2_attempted;

                player_stats.t2_made--;
                player_stats.t2_attempted--;
                player_stats.t2_percentage = player_stats.t2_made / player_stats.t2_attempted;
              }
              else{
                this.visitor_team_stats.t3_made--;
                this.visitor_team_stats.t3_attempted--;
                this.visitor_team_stats.t3_percentage = this.visitor_team_stats.t3_made / this.visitor_team_stats.t3_attempted;

                player_stats.t3_made--;
                player_stats.t3_attempted--;
                player_stats.t3_percentage = player_stats.t3_made / player_stats.t3_attempted;
              }
            }

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
        //If the shot was missed
        else{

          console.log("SHOT MISSED");

          if(this.plays[play_index].team.team_id == this.home_team_id){
            team = 0;

            console.log("SHOT_POINTS: "+shot_points);

            if(shot_points != 1){
              //Home team stats
              this.home_team_stats.shots_list[shot_position].made--;
              this.home_team_stats.shots_list[shot_position].attempted--;
              //Player stats
              player_stats.shots_list[shot_position].made--;
              player_stats.shots_list[shot_position].attempted--;
            }


            if(shot_points == 1){
              this.home_team_stats.t1_attempted--;
              this.home_team_stats.t1_percentage = this.home_team_stats.t1_made / this.home_team_stats.t1_attempted;

              player_stats.t1_attempted--;
              player_stats.t1_percentage = player_stats.t1_made / player_stats.t1_attempted;
            }
            else{
              if(shot_points == 2){
                this.home_team_stats.t2_attempted--;
                this.home_team_stats.t2_percentage = this.home_team_stats.t2_made / this.home_team_stats.t2_attempted;

                player_stats.t2_attempted--;
                player_stats.t2_percentage = player_stats.t2_made / player_stats.t2_attempted;
              }
              else{
                this.home_team_stats.t3_attempted--;
                this.home_team_stats.t3_percentage = this.home_team_stats.t3_made / this.home_team_stats.t3_attempted;

                player_stats.t3_attempted--;
                player_stats.t3_percentage = player_stats.t3_made / player_stats.t3_attempted;
              }
            }

          }
          else{
            team = 1;

            //visitor team stats
            this.visitor_team_stats.shots_list[shot_position].attempted--;
            //Player stats
            player_stats.shots_list[shot_position].attempted--;

            if(shot_points == 1){
              this.visitor_team_stats.t1_attempted--;
              this.visitor_team_stats.t1_percentage = this.visitor_team_stats.t1_made / this.visitor_team_stats.t1_attempted;

              player_stats.t1_attempted--;
              player_stats.t1_percentage = player_stats.t1_made / player_stats.t1_attempted;
            }
            else{
              if(shot_points == 2){
                this.visitor_team_stats.t2_attempted--;
                this.visitor_team_stats.t2_percentage = this.visitor_team_stats.t2_made / this.visitor_team_stats.t2_attempted;

                player_stats.t2_attempted--;
                player_stats.t2_percentage = player_stats.t2_made / player_stats.t2_attempted;
              }
              else{
                this.visitor_team_stats.t3_attempted--;
                this.visitor_team_stats.t3_percentage = this.visitor_team_stats.t3_made / this.visitor_team_stats.t3_attempted;

                player_stats.t3_attempted--;
                player_stats.t3_percentage = player_stats.t3_made / player_stats.t3_attempted;
              }
            }

          }

        }

      }
      else{
        //If the play was a rebound
        if(this.plays[play_index].type == "rebound"){

          player_stats.total_rebounds--;

          //If home team
          if(this.plays[play_index].team.team_id == this.home_team_id){

            this.home_team_stats.total_rebounds--;

            if(this.plays[play_index].rebound_type == "offensive"){
              this.home_team_stats.offensive_rebounds--;
              player_stats.offensive_rebounds--;
            }
            else{
              this.home_team_stats.defensive_rebounds--;
              player_stats.defensive_rebounds--;
            }

          }
          //If visitor team
          else{
            this.visitor_team_stats.total_rebounds--;

            if(this.plays[play_index].rebound_type == "offensive"){
              this.visitor_team_stats.offensive_rebounds--;
              player_stats.offensive_rebounds--;
            }
            else{
              this.visitor_team_stats.defensive_rebounds--;
              player_stats.defensive_rebounds--;
            }

          }

        }
        else{
          //If the play was an assist
          if(this.plays[play_index].type == "assist"){
            player_stats.assists--;

            if(this.plays[play_index].team.team_id == this.home_team_id){
              this.home_team_stats.assists--;
            }
            else{
              this.visitor_team_stats.assists--;
            }

          }
          else{
            //If the play was a steal
            if(this.plays[play_index].type == "steal"){
              player_stats.steals--;

              if(this.plays[play_index].team.team_id == this.home_team_id){
                this.home_team_stats.steals--;
              }
              else{
                this.visitor_team_stats.steals--;
              }

            }
            else{
              if(this.plays[play_index].type == "lost ball"){
                player_stats.turnovers--;
  
                if(this.plays[play_index].team.team_id == this.home_team_id){
                  this.home_team_stats.turnovers--;
                }
                else{
                  this.visitor_team_stats.turnovers--;
                }
  
              }
              else{
                //If the play was a block
                if(this.plays[play_index].type == "block"){
                  
                  if(this.plays[play_index].block_type == "made"){
                    player_stats.blocks_made--;

                    if(this.plays[play_index].team.team_id == this.home_team_id){
                      this.home_team_stats.blocks_made--;
                    }
                    else{
                      this.visitor_team_stats.blocks_made--;
                    }

                  }
                  else{
                    player_stats.blocks_received--;

                    if(this.plays[play_index].team.team_id == this.home_team_id){
                      this.home_team_stats.blocks_received--;
                    }
                    else{
                      this.visitor_team_stats.blocks_received--;
                    }
                    
                  }
    
                  
    
                }
                else{
                  //If the play was a personal foul
                  if(this.plays[play_index].type == "personal foul"){
                    
                    if(this.plays[play_index].block_type == "made"){
                      player_stats.fouls_made--;

                      if(this.plays[play_index].team.team_id == this.home_team_id){
                        this.home_team_stats.fouls_made--;
                      }
                      else{
                        this.visitor_team_stats.fouls_made--;
                      }

                    }
                    else{
                      player_stats.fouls_received--;

                      if(this.plays[play_index].team.team_id == this.home_team_id){
                        this.home_team_stats.fouls_received--;
                      }
                      else{
                        this.visitor_team_stats.fouls_received--;
                      }
                      
                    }
      
                    
      
                  }
                }
              }
            }
          }
        }
      }

      Swal.fire({
        title: 'Por favor espere',
        text: 'Actualizando estadísticas.',
        icon: 'info',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
      });

      this.gameService.updateGame(this.game).then( () => {
        this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats).then(() => {
          this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats).then(() => {

            this.player_stats_gameService.updatePlayer_stats_game(player_stats).then( () => {
              //Delete the play in the server and update the actual plays
              this.playsService.deletePlay(play._id).then( () => {
                this.playsService.getPlays("?game_id="+this.game_id+"&sort=-period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
                  this.plays = plays;
                  Swal.close();
                });
              })
              .catch( (err:HttpErrorResponse) => {
                Swal.fire({
                  title: 'Error al borrar la jugada.',
                  icon: 'error'
                });
              });

            });
      
          });
        });
      });

    });

    
    
    

  }


}
