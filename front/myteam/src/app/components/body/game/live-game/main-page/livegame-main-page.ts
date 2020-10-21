import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { TeamModel } from 'src/app/models/team.model';
import { GameModel } from '../../../../../models/game.model';
import { PlayModel } from '../../../../../models/play.model';
import { Player_stats_gameModel } from '../../../../../models/player_stats_game.model';
import { Team_stats_gameModel } from '../../../../../models/team_stats_game.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { GamesService } from 'src/app/services/games.service';
import { PlaysService } from 'src/app/services/plays.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Player_stats_seasonService } from 'src/app/services/player_stats_season.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';



@Component({
  selector: 'app-livegame-main-page',
  templateUrl: './livegame-main-page.component.html',
  styleUrls: ['./livegame-main-page.component.css']
})
export class MainPageComponent implements OnInit {

  game:GameModel;

  /*
  home_team:TeamModel;
  visitor_team:TeamModel;
  */

  home_players:Player_stats_gameModel[] = []; //Home players stats game
  oncourt_home_players:number[] = []; // Index of on court home players
  bench_home_players:number[] = [];

  home_team_stats:Team_stats_gameModel;

  visitor_players:Player_stats_gameModel[] = []; //Visitor players stats game
  oncourt_visitor_players:number[] = []; // Index of on court visitor players
  bench_visitor_players:number[] = [];

  visitor_team_stats:Team_stats_gameModel;

  player_active:number[] = [-1, -1];

  //Scoreboard
  quarter = 1;
  minutes = -1;
  seconds = -1;
  interval;


  constructor(private gamesService:GamesService, private player_stats_gameService:Player_stats_gamesService, private team_stats_gameService:Team_stats_gameService, private player_stats_seasonService:Player_stats_seasonService, private playsService:PlaysService, private leaguesService:LeaguesService, private router:Router) { 

    //const game_id = this.route.snapshot.paramMap.get('id'); //Game ID

    const game_id = router.url.split('/')[2].toString();  //Game ID

    this.gamesService.getGame(game_id).then((res:GameModel) => {
      this.game = res;

      //If the game didnt start we initialize the timer
      if( (this.game.time_played.minute == 0) && (this.game.time_played.second == 0) && (this.game.time_played.quarter == 0)){
        this.leaguesService.getLeague(this.game.league.league_id).then( (res:LeagueModel) => {
          this.minutes = res.quarter_length;
          this.seconds = 0;
        });
      }
      else{
        this.minutes = this.game.time_played.minute;
        this.seconds = this.game.time_played.second;
        this.quarter = this.game.time_played.quarter;
      }

      //console.log("GAME ID: "+JSON.stringify(game_id));

      //Save the teams stats.
      this.team_stats_gameService.getTeams_stats_game("?game_id="+game_id).then( (teams_stats:Team_stats_gameModel[]) => {

        for(let team_stats of teams_stats){
          if(team_stats.team_id == this.game.home_team.team_id){
            this.home_team_stats = team_stats;
          }
          else{
            this.visitor_team_stats = team_stats;
          }
        }
        
      });

      //Save players stats in the arrays.
      this.player_stats_gameService.getPlayer_stats_games("?game_id="+game_id).then( (players_stats:Player_stats_gameModel[]) => {

        let home_players_cont = 0;
        let visitor_players_cont = 0;

        for(let player of players_stats){

          //If the player belongs to the home team
          if(player.team_id == this.game.home_team.team_id){

            this.home_players.push(player);
            
            if(player.starter){
              this.oncourt_home_players.push(home_players_cont);
            }
            else{
              this.bench_home_players.push(home_players_cont);
            }

            home_players_cont++;

          }
          //If the player belongs to the visitor team
          else{
            
            this.visitor_players.push(player);

            if(player.starter){
              this.oncourt_visitor_players.push(visitor_players_cont);
            }
            else{
              this.bench_visitor_players.push(visitor_players_cont);
            }

            visitor_players_cont++;

          }

        }


      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al recibir los jugadores.',
          icon: 'error'
        });
      });
      

    })
    .catch( (err:HttpErrorResponse) => {
      Swal.fire({
        title: 'Error al cargar el partido de la base de datos.',
        icon: 'error'
      });
    });
    
    
  }

  ngOnInit(): void {
  }

  setPlayer(team_index, player_index){
    this.player_active = [team_index, player_index];
  }

  resumeTimer() {
    this.interval = setInterval(() => {

      //If the quarter doesnt end
      if( (this.seconds) > 0 || (this.minutes > 0) ){

        if(this.seconds > 0){
          this.seconds--;
        }
        else{
          this.minutes--;
          this.seconds = 59;
        }
  
        //Update time played for every player in the court
        for(let player of this.oncourt_home_players){
          if(this.home_players[player].time_played.seconds < 59){
            this.home_players[player].time_played.seconds++;
          }
          else{
            this.home_players[player].time_played.minutes++;
            this.home_players[player].time_played.seconds = 0;
          }
          
          //Update the stat in the database.
          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[player]);
        }

        for(let player of this.oncourt_visitor_players){
          if(this.visitor_players[player].time_played.seconds < 59){
            this.visitor_players[player].time_played.seconds++;
          }
          else{
            this.visitor_players[player].time_played.minutes++;
            this.visitor_players[player].time_played.seconds = 0;
          }
          //Update the stat in the database.
          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[player]);
        }

        //Update the time played for every team
        if(this.home_team_stats.time_played.seconds < 59){
          this.home_team_stats.time_played.seconds++;
        }
        else{
          this.home_team_stats.time_played.minutes++;
          this.home_team_stats.time_played.seconds = 0;
        }

        this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);

        if(this.visitor_team_stats.time_played.seconds < 59){
          this.visitor_team_stats.time_played.seconds++;
        }
        else{
          this.visitor_team_stats.time_played.minutes++;
          this.visitor_team_stats.time_played.seconds = 0;
        }

        this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);
  
        //Update the game timer
        this.game.time_played = {
          minute: this.minutes,
          second: this.seconds,
          quarter: this.quarter
        };
  
        this.gamesService.updateGame(this.game).catch( (err:HttpErrorResponse) => {
          Swal.fire({
            title: 'Error al actualizar el timer del partido en la base de datos.',
            icon: 'error'
          });
        });

      }
      //If the quarter ends
      else{

        clearInterval(this.interval);

        if(this.quarter < 4){
          this.quarter++;
        }

      }

    },1000);

  }

  pauseTimer(){
    clearInterval(this.interval);
  }

  createFTPlay(shot_made){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        //If the shot was made we add to the score
        if(shot_made){
          this.game.home_team_score += 1;
        }

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }
      }
      else{
        if(this.player_active[0] == 1){

          //If the shot was made we add to the score
          if(shot_made){
            this.game.visitor_team_score += 1;
          }

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "shot";
      play.shot_type = "ft";
      play.shot_made = shot_made;

      //Post the play
      this.playsService.createPlay(play).then( res => {
        
        //If the player belongs to the home team
        if(this.player_active[0] == 0){

          if(shot_made){
            this.home_players[this.player_active[1]].points++;
            this.home_players[this.player_active[1]].t1_made++;

            this.home_team_stats.t1_made++;
          }

          this.home_players[this.player_active[1]].t1_attempted++;

          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[this.player_active[1]]);

          this.home_team_stats.t1_attempted++;

          this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);
          
        }
        //If the player belongs to the visitor team
        else{
          if(shot_made){
            this.visitor_players[this.player_active[1]].points++;
            this.visitor_players[this.player_active[1]].t1_made++;

            this.visitor_team_stats.t1_made++;
          }

          this.visitor_players[this.player_active[1]].t1_attempted++;

          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[this.player_active[1]]);
          
          this.visitor_team_stats.t1_attempted++;

          this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);

        }

        

      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });

      //Update the game
      this.gamesService.updateGame(this.game).catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al actualizar el partido.',
          icon: 'error'
        });
      });
      
    }

  }

  createReboundPlay(rebound_type){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "rebound";
      play.rebound_type = rebound_type;

      //Post the play
      this.playsService.createPlay(play).then( () => {

        //If the player belongs to the home team
        if(this.player_active[0] == 0){

          if(rebound_type == "offensive"){
            this.home_players[this.player_active[1]].offensive_rebounds++;
            this.home_team_stats.offensive_rebounds++;
          }
          else{
            this.home_players[this.player_active[1]].defensive_rebounds++;
            this.home_team_stats.defensive_rebounds++;
          }

          this.home_players[this.player_active[1]].total_rebounds++;

          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[this.player_active[1]]);

          this.home_team_stats.total_rebounds++;

          this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);
          
        }
        //If the player belongs to the visitor team
        else{
          if(rebound_type == "offensive"){
            this.visitor_players[this.player_active[1]].offensive_rebounds++;
            this.visitor_team_stats.offensive_rebounds++;
          }
          else{
            this.visitor_players[this.player_active[1]].defensive_rebounds++;
            this.visitor_team_stats.defensive_rebounds++;
          }

          this.visitor_players[this.player_active[1]].total_rebounds++;

          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[this.player_active[1]]);

          this.visitor_team_stats.total_rebounds++;

          this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);

        }

      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

  createBlockPlay(block_type){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "block";
      play.block_type = block_type;

      //Post the play
      this.playsService.createPlay(play).then( () => {
        //If the player belongs to the home team
        if(this.player_active[0] == 0){

          if(block_type == "received"){
            this.home_players[this.player_active[1]].blocks_received++;
            this.home_team_stats.blocks_received++;
          }
          else{
            this.home_players[this.player_active[1]].blocks_made++;
            this.home_team_stats.blocks_made++;
          }

          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[this.player_active[1]]);

          this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);
          
        }
        //If the player belongs to the visitor team
        else{
          if(block_type == "received"){
            this.visitor_players[this.player_active[1]].blocks_received++;
            this.visitor_team_stats.blocks_received++;
          }
          else{
            this.visitor_players[this.player_active[1]].blocks_made++;
            this.visitor_team_stats.blocks_made++;
          }

          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[this.player_active[1]]);

          this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);

        }
      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

  createAssistPlay(){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "assist";

      //Post the play
      this.playsService.createPlay(play).then( () => {

        //If the player belongs to the home team
        if(this.player_active[0] == 0){

          this.home_players[this.player_active[1]].assists++;
          this.home_team_stats.assists++;
          
          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[this.player_active[1]]);

          this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);
          
        }
        //If the player belongs to the visitor team
        else{

          this.visitor_players[this.player_active[1]].assists++;
          this.visitor_team_stats.assists++;

          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[this.player_active[1]]);

          this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);

        }

      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

  createStealPlay(){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "steal";

      //Post the play
      this.playsService.createPlay(play).catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

  createLostBallPlay(){
    
    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "lost ball";

      //Post the play
      this.playsService.createPlay(play).catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

  createPersonalFoulPlay(foul_type){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let play = new PlayModel();

      //Get the team's info
      if(this.player_active[0] == 0){

        play.player = {
          player_id: this.home_players[this.player_active[1]].player_id,
          player_name: this.home_players[this.player_active[1]].player_name,
          player_last_name: this.home_players[this.player_active[1]].player_lastName,
          player_img: this.home_players[this.player_active[1]].player_img,
        };
        play.team = {
          team_id: this.game.home_team.team_id,
          team_img: this.game.home_team.club_img
        }

      }
      else{
        if(this.player_active[0] == 1){

          play.player = {
            player_id: this.visitor_players[this.player_active[1]].player_id,
            player_name: this.visitor_players[this.player_active[1]].player_name,
            player_last_name: this.visitor_players[this.player_active[1]].player_lastName,
            player_img: this.visitor_players[this.player_active[1]].player_img,
          };
          play.team = {
            team_id: this.game.visitor_team.team_id,
            team_img: this.game.visitor_team.club_img
          }

        }
      }

      //Check the rest of the fields
      play.game_id = this.game._id;
      play.home_team_score = this.game.home_team_score;
      play.visitor_team_score = this.game.visitor_team_score;
      play.time = {
        minute: this.minutes,
        second: this.seconds
      };
      play.period = this.quarter;
      play.type = "personal foul";
      play.foul_type = foul_type;

      //Post the play
      this.playsService.createPlay(play).then( res => {

        //If the play is created we need to update the player and team stats for the game

        //If the player belongs to the home team
        if(this.player_active[0] == 0){
          if(foul_type == "made"){
            this.home_players[this.player_active[1]].fouls_made++;
          }
          else{
            this.home_players[this.player_active[1]].fouls_received++;
          }

          //Update the player stats
          this.player_stats_gameService.updatePlayer_stats_game(this.home_players[this.player_active[1]]);
          
        }
        //If the player belongs to the visitor team
        else{
          if(foul_type == "made"){
            this.visitor_players[this.player_active[1]].fouls_made++;
          }
          else{
            this.visitor_players[this.player_active[1]].fouls_received++;
          }

          //Update the player stats
          this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[this.player_active[1]]);

        }

        


      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });
      
    }

  }

}
