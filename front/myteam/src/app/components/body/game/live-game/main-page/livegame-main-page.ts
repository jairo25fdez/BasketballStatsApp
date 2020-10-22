import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

//Models
import { LeagueModel } from 'src/app/models/league.model';
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
  home_oncourt_timers = []; //We use it to calculate the time that players played before we leave the page.

  home_team_stats:Team_stats_gameModel;

  visitor_players:Player_stats_gameModel[] = []; //Visitor players stats game
  oncourt_visitor_players:number[] = []; // Index of on court visitor players
  bench_visitor_players:number[] = [];
  visitor_oncourt_timers = []; //We use it to calculate the time that players played before we leave the page.

  visitor_team_stats:Team_stats_gameModel;

  player_active:number[] = [-1, -1];

  shot_zone = "";

  //Plays
  plays:PlayModel[] = [];

  //Scoreboard
  minutes_per_quarter = 0;
  number_of_quarters = 0;
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
        this.leaguesService.getLeague(this.game.league.league_id).then( (res:LeagueModel) => {
          this.minutes_per_quarter = res.quarter_length;
        });
        this.minutes = this.game.time_played.minute;
        this.seconds = this.game.time_played.second;
        this.quarter = this.game.time_played.quarter;
      }

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

        //Initialize on court players timers
        let player_cont = 0;
        for(let player of this.oncourt_home_players){
          this.home_oncourt_timers[player_cont] = [this.quarter, this.minutes, this.seconds];
          player_cont++;
        }

        player_cont = 0;
        for(let player of this.oncourt_visitor_players){
          this.visitor_oncourt_timers[player_cont] = [this.quarter, this.minutes, this.seconds];
          player_cont++;
        }


      })
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al recibir los jugadores.',
          icon: 'error'
        });
      });
      
      this.leaguesService.getLeague(this.game.league.league_id).then( (league:LeagueModel) => {
        this.number_of_quarters = league.quarters_num;
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

  ngOnDestroy(): void{

    //Update the stats before the user leaves the main page.
    let timer_cont = 0;
    for(let player_index of this.oncourt_home_players){

      //Update the time played for every player
      this.calculateTime(0, player_index, this.home_oncourt_timers[timer_cont]);

      this.player_stats_gameService.updatePlayer_stats_game(this.home_players[player_index]);
    }

    timer_cont = 0;
    for(let player_index of this.oncourt_visitor_players){

      //Update the time played for every player
      this.calculateTime(1, player_index, this.visitor_oncourt_timers[timer_cont]);

      this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[player_index]);
    }

    this.updateUSG(0);
    this.updateUSG(1);

    this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);
    this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);

    for(let play of this.plays){
      this.playsService.createPlay(play);
    }

    this.gamesService.updateGame(this.game);

  }

  calculateTime(team, player_index, player_in){

    let player_out = [this.quarter, this.minutes, this.seconds];

    let date1 = new Date();
    date1.setHours(0, player_in[1], player_in[2]);
    let date2 = new Date();
    date2.setHours(0, player_out[1], player_out[2]);


    // get total seconds between the times
    var delta = Math.abs(date2.getTime() - date1.getTime()) / 1000;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;

    //console.log("MINUTES: "+minutes);
    //console.log("SECONDS: "+seconds);

    if(team == 0){

      if( (this.home_players[player_index].time_played.seconds + seconds) > 59){
        this.home_players[player_index].time_played.seconds = 0;
        
        minutes += Math.ceil(seconds / 60);
        seconds = seconds % 60;
      }

      this.home_players[player_index].time_played.minutes += minutes;
      this.home_players[player_index].time_played.seconds += seconds;
    }
    else{

      if( (this.visitor_players[player_index].time_played.seconds + seconds) > 59){
        this.visitor_players[player_index].time_played.seconds = 0;
        
        minutes += Math.ceil(seconds / 60);
        seconds = seconds % 60;
      }

      this.visitor_players[player_index].time_played.minutes += minutes;
      this.visitor_players[player_index].time_played.seconds += seconds;
    }
    

  }

  setPlayer(team_index, player_index){
    this.player_active = [team_index, player_index];
  }

  resumeTimer() {

    //Initialize on court players timers
    let player_cont = 0;
    for(let player of this.oncourt_home_players){
      this.home_oncourt_timers[player_cont] = [this.quarter, this.minutes, this.seconds];
      player_cont++;
    }

    player_cont = 0;
    for(let player of this.oncourt_visitor_players){
      this.visitor_oncourt_timers[player_cont] = [this.quarter, this.minutes, this.seconds];
      player_cont++;
    }

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

        //Update the time played for every team
        if(this.home_team_stats.time_played.seconds < 59){
          this.home_team_stats.time_played.seconds++;
        }
        else{
          this.home_team_stats.time_played.minutes++;
          this.home_team_stats.time_played.seconds = 0;
        }

        //this.team_stats_gameService.updateTeam_stats_game(this.home_team_stats);

        if(this.visitor_team_stats.time_played.seconds < 59){
          this.visitor_team_stats.time_played.seconds++;
        }
        else{
          this.visitor_team_stats.time_played.minutes++;
          this.visitor_team_stats.time_played.seconds = 0;
        }

        //this.team_stats_gameService.updateTeam_stats_game(this.visitor_team_stats);
  
        //Update the game timer
        this.game.time_played = {
          minute: this.minutes,
          second: this.seconds,
          quarter: this.quarter
        };

      }
      //If the quarter ends
      else{

        clearInterval(this.interval);

        if(this.quarter < 4){
          this.quarter++;
          this.minutes = this.minutes_per_quarter;
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }
      

      //If the player belongs to the home team
      if(this.player_active[0] == 0){

        if(shot_made){
          this.home_players[this.player_active[1]].points++;
          this.home_players[this.player_active[1]].t1_made++;

          this.home_team_stats.t1_made++;
        }

        this.home_team_stats.t1_attempted++;

        //Update team FT%
        this.home_team_stats.t1_percentage = (this.home_team_stats.t1_made / this.home_team_stats.t1_attempted)*100;

        this.home_players[this.player_active[1]].t1_attempted++;

        //Update player FT%
        this.home_players[this.player_active[1]].t1_percentage = (this.home_players[this.player_active[1]].t1_made / this.home_players[this.player_active[1]].t1_attempted)*100;

        
      }
      //If the player belongs to the visitor team
      else{
        if(shot_made){
          this.visitor_players[this.player_active[1]].points++;
          this.visitor_players[this.player_active[1]].t1_made++;

          this.visitor_team_stats.t1_made++;
        }

        this.visitor_players[this.player_active[1]].t1_attempted++;

        //Update player FT%
        this.visitor_players[this.player_active[1]].t1_percentage = (this.visitor_players[this.player_active[1]].t1_made / this.visitor_players[this.player_active[1]].t1_attempted)*100;

        this.visitor_team_stats.t1_attempted++;

        //Update team FT%
        this.visitor_team_stats.t1_percentage = (this.visitor_team_stats.t1_made / this.visitor_team_stats.t1_attempted)*100;

      }

    }

  }

  //Update the USG for every player in the team
  updateUSG(team_index){

    if(team_index == 0){
      for(let player_index of this.oncourt_home_players){
        
        let usg_1 = 100*( (this.home_players[player_index].t2_attempted + this.home_players[player_index].t3_attempted) + 0.44*(this.home_players[player_index].t1_attempted) + (this.home_players[player_index].turnovers))*this.home_team_stats.time_played.minutes;
        let usg_2 = ( (this.home_team_stats.t2_attempted + this.home_team_stats.t3_attempted) + 0.44*(this.home_team_stats.t1_attempted) + this.home_team_stats.turnovers)*(this.home_players[player_index].time_played.minutes);

        this.home_players[player_index].usage = (usg_1 / usg_2);

      }
    }
    else{
      for(let player_index of this.oncourt_visitor_players){

        let usg_1 = 100*( (this.visitor_players[player_index].t2_attempted + this.visitor_players[player_index].t3_attempted) + 0.44*(this.visitor_players[player_index].t1_attempted) + (this.visitor_players[player_index].turnovers))*this.visitor_team_stats.time_played.minutes;
        let usg_2 = ( (this.visitor_team_stats.t2_attempted + this.visitor_team_stats.t3_attempted) + 0.44*(this.visitor_team_stats.t1_attempted) + this.visitor_team_stats.turnovers)*(this.visitor_players[player_index].time_played.minutes);
      
        this.visitor_players[player_index].usage = usg_1 / usg_2;

      }
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }

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

        this.home_team_stats.total_rebounds++;
        
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

        this.visitor_team_stats.total_rebounds++;

      }


      
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }

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


      }
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }

      //If the player belongs to the home team
      if(this.player_active[0] == 0){

        this.home_players[this.player_active[1]].assists++;
        this.home_team_stats.assists++;
        
      }
      //If the player belongs to the visitor team
      else{

        this.visitor_players[this.player_active[1]].assists++;
        this.visitor_team_stats.assists++;

      }

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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }

      //If the player belongs to the home team
      if(this.player_active[0] == 0){

        this.home_players[this.player_active[1]].steals++;
        this.home_team_stats.steals++;
        
      }
      //If the player belongs to the visitor team
      else{

        this.visitor_players[this.player_active[1]].steals++;
        this.visitor_team_stats.steals++;

      }

    }

  }

  createTurnoverPlay(){
    
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }


      //If the player belongs to the home team
      if(this.player_active[0] == 0){

        this.home_players[this.player_active[1]].turnovers++;
        this.home_team_stats.turnovers++;
        
      }
      //If the player belongs to the visitor team
      else{

        this.visitor_players[this.player_active[1]].turnovers++;
        this.visitor_team_stats.turnovers++;

      }

      
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

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }

      //If the player belongs to the home team
      if(this.player_active[0] == 0){
        if(foul_type == "made"){
          this.home_players[this.player_active[1]].fouls_made++;
          this.home_team_stats.fouls_made++;
        }
        else{
          this.home_team_stats.fouls_received++;
          this.home_players[this.player_active[1]].fouls_received++;
        }
        
      }
      //If the player belongs to the visitor team
      else{
        if(foul_type == "made"){
          this.visitor_players[this.player_active[1]].fouls_made++;
          this.visitor_team_stats.fouls_made++;
        }
        else{
          this.visitor_players[this.player_active[1]].fouls_received++;
          this.visitor_team_stats.fouls_received++;
        }

      }

    }

  }

  setShotZone(shot_zone){
    this.shot_zone = shot_zone;
  }

  createShotPlay(shot_made){
    
    if( (this.player_active != [-1,-1]) && (this.shot_zone != "") ){
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
      play.type = "shot";
      play.shot_type = "fg";
      play.shot_position = this.shot_zone;

      //Save the play in the array
      if(this.plays.length == 0){
        this.plays[0] = play;
      }
      else{
        this.plays.push(play);
      }


      //If the player belongs to the home team
      if(this.player_active[0] == 0){

        //If the shot was a 3 points shot
        if( this.shot_zone == "lc3" || this.shot_zone == "le3" || this.shot_zone == "c3" || this.shot_zone == "re3" || this.shot_zone == "rc3" ){
          if(shot_made){
            //Player stats
            this.home_players[this.player_active[1]].shots_list[this.shot_zone].made++;
            this.home_players[this.player_active[1]].t3_made++;
            this.home_players[this.player_active[1]].points += 3;
            //Team stats
            this.home_team_stats.shots_list[this.shot_zone].made++;
            this.home_team_stats.t3_made++;
            this.home_team_stats.points += 3;

            this.game.home_team_score += 3;
          }
          //Player stats
          this.home_players[this.player_active[1]].shots_list[this.shot_zone].attempted++;
          this.home_players[this.player_active[1]].t3_attempted++;
          this.home_players[this.player_active[1]].t3_percentage = 100*(this.home_players[this.player_active[1]].t3_made / this.home_players[this.player_active[1]].t3_attempted);
        
          //Team stats
          this.home_team_stats.shots_list[this.shot_zone].attempted++;
          this.home_team_stats.t3_attempted++;
          this.home_team_stats.t3_percentage = 100*(this.home_team_stats.t3_made / this.home_team_stats.t3_attempted);

        }
        //If the shot was a 2 points shot
        else{
          if(shot_made){
            //Player stats
            this.home_players[this.player_active[1]].shots_list[this.shot_zone].made++;
            this.home_players[this.player_active[1]].t2_made++;
            this.home_players[this.player_active[1]].points += 2;
            //Team stats
            this.home_team_stats.shots_list[this.shot_zone].made++;
            this.home_team_stats.t2_made++;
            this.home_team_stats.points += 2;

            this.game.home_team_score += 2;
          }
          //Player stats
          this.home_players[this.player_active[1]].shots_list[this.shot_zone].attempted++;
          this.home_players[this.player_active[1]].t2_attempted++;
          this.home_players[this.player_active[1]].t2_percentage = 100*(this.home_players[this.player_active[1]].t2_made / this.home_players[this.player_active[1]].t2_attempted);
        
          //Team stats
          this.home_team_stats.shots_list[this.shot_zone].attempted++;
          this.home_team_stats.t2_attempted++;
          this.home_team_stats.t2_percentage = 100*(this.home_team_stats.t2_made / this.home_team_stats.t2_attempted);
        }


      }
      //If the player belongs to the visitor team
      else{

        //If the shot was a 3 points shot
        if( this.shot_zone == "lc3" || this.shot_zone == "le3" || this.shot_zone == "c3" || this.shot_zone == "re3" || this.shot_zone == "rc3" ){
          if(shot_made){
            //Player stats
            this.visitor_players[this.player_active[1]].shots_list[this.shot_zone].made++;
            this.visitor_players[this.player_active[1]].t3_made++;
            this.visitor_players[this.player_active[1]].points += 3;
            //Team stats
            this.visitor_team_stats.shots_list[this.shot_zone].made++;
            this.visitor_team_stats.t3_made++;
            this.visitor_team_stats.points += 3;

            this.game.visitor_team_score += 3;
          }
          //Player stats
          this.visitor_players[this.player_active[1]].shots_list[this.shot_zone].attempted++;
          this.visitor_players[this.player_active[1]].t3_attempted++;
          this.visitor_players[this.player_active[1]].t3_percentage = 100*(this.visitor_players[this.player_active[1]].t3_made / this.visitor_players[this.player_active[1]].t3_attempted);
          //Team stats
          this.visitor_team_stats.shots_list[this.shot_zone].attempted++;
          this.visitor_team_stats.t3_attempted++;
          this.visitor_team_stats.t3_percentage = 100*(this.visitor_team_stats.t3_made / this.visitor_team_stats.t3_attempted);
        
        }
        //If the shot was a 2 points shot
        else{
          if(shot_made){
            //Player stats
            this.visitor_players[this.player_active[1]].shots_list[this.shot_zone].made++;
            this.visitor_players[this.player_active[1]].t2_made++;
            this.visitor_players[this.player_active[1]].points += 2;
            //Team stats
            this.visitor_team_stats.shots_list[this.shot_zone].made++;
            this.visitor_team_stats.t2_made++;
            this.visitor_team_stats.points += 2;

            this.game.visitor_team_score += 2;
          }
          //Player stats
          this.visitor_players[this.player_active[1]].shots_list[this.shot_zone].attempted++;
          this.visitor_players[this.player_active[1]].t2_attempted++;
          this.visitor_players[this.player_active[1]].t2_percentage = 100*(this.visitor_players[this.player_active[1]].t2_made / this.visitor_players[this.player_active[1]].t2_attempted);
          //Team stats
          this.visitor_team_stats.shots_list[this.shot_zone].attempted++;
          this.visitor_team_stats.t2_attempted++;
          this.visitor_team_stats.t2_percentage = 100*(this.visitor_team_stats.t2_made / this.visitor_team_stats.t2_attempted);
        }
        


      }

    }

    this.shot_zone = "";

  }

  scoreboardMinutes(plus){

    if(plus){

      if( (this.minutes+1) <= this.minutes_per_quarter){
        this.minutes++;
      }

    }
    else{
      if( (this.minutes-1) >= 0 ){
        this.minutes--;
      }
    }

    

  }

  scoreboardSeconds(plus){

    if(plus){

      if( (this.seconds+1) <= 59){
        this.seconds++;
      }

    }
    else{
      if( (this.seconds-1) >= 0 ){
        this.seconds--;
      }
    }

    

  }

  scoreboardQuarter(plus){

    if(plus){

      //if( (this.quarter+1) <= this.number_of_quarters){
      this.quarter++;

    }
    else{
      if( (this.quarter-1) >= 1 ){
        this.quarter--;
      }
    }

    

  }

}
