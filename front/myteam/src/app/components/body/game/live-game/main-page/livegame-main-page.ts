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
import { Team_stats_seasonModel } from '../../../../../models/team_stats_season.model';
import { Player_stats_seasonModel } from '../../../../../models/player_stats_season.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { GamesService } from 'src/app/services/games.service';
import { PlaysService } from 'src/app/services/plays.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Player_stats_seasonService } from 'src/app/services/player_stats_season.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';
import { Team_stats_seasonService } from 'src/app/services/team_stats_season.service';




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
  player_bench:number[] = [-1, -1];

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


  constructor(private gamesService:GamesService, private player_stats_gameService:Player_stats_gamesService, private team_stats_gameService:Team_stats_gameService, private team_stats_seasonService:Team_stats_seasonService, private player_stats_seasonService:Player_stats_seasonService, private playsService:PlaysService, private leaguesService:LeaguesService, private router:Router) { 

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

    this.updateStats();

  }

  updateStats():void{

    //Update the stats before the user leaves the main page.
    let timer_cont = 0;
    for(let player_index of this.oncourt_home_players){

      //Update the time played for every player
      this.calculateTime(0, player_index, this.home_oncourt_timers[timer_cont]);

      this.updateUSG(0, player_index);

      this.player_stats_gameService.updatePlayer_stats_game(this.home_players[player_index]);
    }

    for(let player_index of this.bench_home_players){

      this.player_stats_gameService.updatePlayer_stats_game(this.home_players[player_index]);
    }

    timer_cont = 0;
    for(let player_index of this.oncourt_visitor_players){

      //Update the time played for every player
      this.calculateTime(1, player_index, this.visitor_oncourt_timers[timer_cont]);

      this.updateUSG(1, player_index);

      this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[player_index]);
    }

    for(let player_index of this.bench_visitor_players){
      this.player_stats_gameService.updatePlayer_stats_game(this.visitor_players[player_index]);
    }

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
        //If we are in the final quarter and the score is not tied we end the game and update the stats
        else{
          if(this.game.home_team_score != this.game.visitor_team_score){

            Swal.fire({
              title: 'Por favor espere',
              text: 'Actualizando estadísticas por temporada',
              icon: 'info',
              allowOutsideClick: false,
              onBeforeOpen: () => {
                  Swal.showLoading()
              },
            });

            this.updateStats();

            
            //Get the stats of the seasons for the player thats stored in the database
            for(let player of this.home_players){
              this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+player.player_id+"&team_id="+player.team_id+"&season="+player.season).then( (stats_season:Player_stats_seasonModel[]) => {

                //Reset the values

                stats_season[0].time_played = {
                  minutes: 0,
                  seconds: 0,
                  average: 0,
                };
                stats_season[0].games_played = 0;
                stats_season[0].wins = 0;
                stats_season[0].losses = 0;
                stats_season[0].win_percentage = 0;
                stats_season[0].points_stats = {
                    total_points: 0,
                    average_points: 0,
                    points_per_minute: 0,
                    points_per_field_shot: 0,
                    points_per_shot_t2: 0,
                    points_per_shot_t3: 0
                };
                stats_season[0].shots_stats = {
                    total_shots: 0,
                    total_FG_shots: 0,
                    shots_list: {
                        lc3: {made: 0, attempted: 0},
                        le3: {made: 0, attempted: 0},
                        c3: {made: 0, attempted: 0},
                        re3: {made: 0, attempted: 0},
                        rc3: {made: 0, attempted: 0},
                        lmc2: {made: 0, attempted: 0},
                        lme2: {made: 0, attempted: 0},
                        cm2: {made: 0, attempted: 0},
                        rme2: {made: 0, attempted: 0},
                        rmc2: {made: 0, attempted: 0},
                        lp2: {made: 0, attempted: 0},
                        rp2: {made: 0, attempted: 0},
                        lft2: {made: 0, attempted: 0},
                        rft2: {made: 0, attempted: 0}
                    },
                    eFG: 0,
                    fg_percentage: 0,
                    t2_stats: {
                        t2_made: 0,
                        t2_attempted: 0,
                        t2_percentage: 0,
                        t2_volume_percentage: 0
                    },
                    t3_stats: {
                        t3_made: 0,
                        t3_attempted: 0,
                        t3_percentage: 0,
                        t3_volume_percentage: 0
                    },
                    t1_stats: {
                        t1_made: 0,
                        t1_attempted: 0,
                        t1_percentage: 0,
                        t1_volume_percentage: 0
                    }
                };
                stats_season[0].assists_stats = {
                    total_assists: 0,
                    assists_percentage: 0,
                    assists_per_lost: 0
                };
                stats_season[0].steals_stats = {
                    total_steals: 0,
                    steals_per_minute: 0,
                    steals_per_game: 0
                };
                stats_season[0].lost_balls_stats = {
                    total_losts: 0,
                    turnovers_per_minute: 0
                };
                stats_season[0].rebounds_stats = {
                    total_rebounds: 0,
                    average_rebounds: 0,
                    offensive_rebounds: 0,
                    defensive_rebounds: 0,
                    total_rebounds_per_minute: 0,
                    off_rebounds_per_minute: 0,
                    def_rebounds_per_minute: 0
                };
                stats_season[0].blocks_stats = {
                    total_blocks_made: 0,
                    total_blocks_received: 0,
                    blocks_made_per_game: 0,
                    blocks_received_per_game: 0,
                    blocks_received_per_minute: 0,
                    blocks_made_per_minute: 0
                };
                stats_season[0].usage = 0;
                stats_season[0].fouls_stats = {
                    total_fouls_made: 0,
                    fouls_made_per_minute: 0,
                    total_fouls_received: 0,
                    fouls_received_per_minute: 0,
                };
                

                //Find every game played for the selected player with the team this season
                this.player_stats_gameService.getPlayer_stats_games("?player_id="+player.player_id+"&team_id="+player.team_id+"&season="+player.season).then( (stats_game:Player_stats_gameModel[]) => {

                  
                  for(let game_stats of stats_game){

                    //Update the time played through the season
                    if( (stats_season[0].time_played.seconds + game_stats.time_played.seconds) > 59){
                      stats_season[0].time_played.seconds = 0;
                      
                      game_stats.time_played.minutes += Math.ceil(game_stats.time_played.seconds / 60);
                      game_stats.time_played.seconds = game_stats.time_played.seconds % 60;
                    }
              
                    stats_season[0].time_played.minutes += game_stats.time_played.minutes;
                    stats_season[0].time_played.seconds += game_stats.time_played.seconds;
                    
                    //Update games played
                    stats_season[0].games_played++;

                    //Update shots stats
                      //Shots list
                    stats_season[0].shots_stats.shots_list.lc3.made += game_stats.shots_list.lc3.made;
                    stats_season[0].shots_stats.shots_list.lc3.attempted += game_stats.shots_list.lc3.attempted;

                    stats_season[0].shots_stats.shots_list.le3.made += game_stats.shots_list.le3.made;
                    stats_season[0].shots_stats.shots_list.le3.attempted += game_stats.shots_list.le3.attempted;

                    stats_season[0].shots_stats.shots_list.c3.made += game_stats.shots_list.c3.made;
                    stats_season[0].shots_stats.shots_list.c3.attempted += game_stats.shots_list.c3.attempted;

                    stats_season[0].shots_stats.shots_list.re3.made += game_stats.shots_list.re3.made;
                    stats_season[0].shots_stats.shots_list.re3.attempted += game_stats.shots_list.re3.attempted;

                    stats_season[0].shots_stats.shots_list.rc3.made += game_stats.shots_list.rc3.made;
                    stats_season[0].shots_stats.shots_list.rc3.attempted += game_stats.shots_list.rc3.attempted;

                    stats_season[0].shots_stats.shots_list.lmc2.made += game_stats.shots_list.lmc2.made;
                    stats_season[0].shots_stats.shots_list.lmc2.attempted += game_stats.shots_list.lmc2.attempted;

                    stats_season[0].shots_stats.shots_list.lme2.made += game_stats.shots_list.lme2.made;
                    stats_season[0].shots_stats.shots_list.lme2.attempted += game_stats.shots_list.lme2.attempted;

                    stats_season[0].shots_stats.shots_list.cm2.made += game_stats.shots_list.cm2.made;
                    stats_season[0].shots_stats.shots_list.cm2.attempted += game_stats.shots_list.cm2.attempted;

                    stats_season[0].shots_stats.shots_list.rme2.made += game_stats.shots_list.rme2.made;
                    stats_season[0].shots_stats.shots_list.rme2.attempted += game_stats.shots_list.rme2.attempted;

                    stats_season[0].shots_stats.shots_list.rmc2.made += game_stats.shots_list.rmc2.made;
                    stats_season[0].shots_stats.shots_list.rmc2.attempted += game_stats.shots_list.rmc2.attempted;

                    stats_season[0].shots_stats.shots_list.lp2.made += game_stats.shots_list.lp2.made;
                    stats_season[0].shots_stats.shots_list.lp2.attempted += game_stats.shots_list.lp2.attempted;

                    stats_season[0].shots_stats.shots_list.rp2.made += game_stats.shots_list.rp2.made;
                    stats_season[0].shots_stats.shots_list.rp2.attempted += game_stats.shots_list.rp2.attempted;

                    stats_season[0].shots_stats.shots_list.lft2.made += game_stats.shots_list.lft2.made;
                    stats_season[0].shots_stats.shots_list.lft2.attempted += game_stats.shots_list.lft2.attempted;

                    stats_season[0].shots_stats.shots_list.rft2.made += game_stats.shots_list.rft2.made;
                    stats_season[0].shots_stats.shots_list.rft2.attempted += game_stats.shots_list.rft2.attempted;

                      //Total shots
                    stats_season[0].shots_stats.total_shots += game_stats.t2_attempted + game_stats.t3_attempted + game_stats.t1_attempted;
                      //Total FG shots
                    stats_season[0].shots_stats.total_FG_shots += game_stats.t2_attempted + game_stats.t3_attempted;

                      //t2_stats
                    stats_season[0].shots_stats.t2_stats.t2_made += game_stats.t2_made;
                    stats_season[0].shots_stats.t2_stats.t2_attempted += game_stats.t2_attempted;
                    stats_season[0].shots_stats.t2_stats.t2_percentage = 100*(stats_season[0].shots_stats.t2_stats.t2_made / stats_season[0].shots_stats.t2_stats.t2_attempted);
                    stats_season[0].shots_stats.t2_stats.t2_volume_percentage = (stats_season[0].shots_stats.t2_stats.t2_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                      //t3_stats
                    stats_season[0].shots_stats.t3_stats.t3_made += game_stats.t3_made;
                    stats_season[0].shots_stats.t3_stats.t3_attempted += game_stats.t3_attempted;
                    stats_season[0].shots_stats.t3_stats.t3_percentage = 100*(stats_season[0].shots_stats.t3_stats.t3_made / stats_season[0].shots_stats.t3_stats.t3_attempted);
                    stats_season[0].shots_stats.t3_stats.t3_volume_percentage = (stats_season[0].shots_stats.t3_stats.t3_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                      //t1_stats
                    stats_season[0].shots_stats.t1_stats.t1_made += game_stats.t1_made;
                    stats_season[0].shots_stats.t1_stats.t1_attempted += game_stats.t1_attempted;
                    stats_season[0].shots_stats.t1_stats.t1_percentage = 100*(stats_season[0].shots_stats.t1_stats.t1_made / stats_season[0].shots_stats.t1_stats.t1_attempted);
                    stats_season[0].shots_stats.t1_stats.t1_volume_percentage = (stats_season[0].shots_stats.t1_stats.t1_attempted*100) / stats_season[0].shots_stats.total_shots;

                      //eFG
                    stats_season[0].shots_stats.eFG = 100*(stats_season[0].shots_stats.total_FG_shots + (stats_season[0].shots_stats.t3_stats.t3_made)*0.5 ) / stats_season[0].shots_stats.total_FG_shots;

                      //%FG
                    stats_season[0].shots_stats.fg_percentage = 100*( (stats_season[0].shots_stats.t2_stats.t2_made + stats_season[0].shots_stats.t3_stats.t3_made) / (stats_season[0].shots_stats.t2_stats.t2_attempted + stats_season[0].shots_stats.t3_stats.t3_attempted) );

                    //Update points stats
                    stats_season[0].points_stats.total_points += game_stats.points;
                    stats_season[0].points_stats.average_points = stats_season[0].points_stats.total_points / stats_season[0].games_played;
                    stats_season[0].points_stats.points_per_minute = stats_season[0].points_stats.total_points / stats_season[0].time_played.minutes;
                    stats_season[0].points_stats.points_per_field_shot = ( (stats_season[0].shots_stats.t2_stats.t2_made*2) + (stats_season[0].shots_stats.t3_stats.t3_made*3) ) / stats_season[0].shots_stats.total_FG_shots;
                    stats_season[0].points_stats.points_per_shot_t2 = (stats_season[0].shots_stats.t2_stats.t2_made*2) / stats_season[0].shots_stats.t2_stats.t2_attempted;
                    stats_season[0].points_stats.points_per_shot_t3 = (stats_season[0].shots_stats.t3_stats.t3_made*3) / stats_season[0].shots_stats.t3_stats.t3_attempted;

                    //Steals stats
                    stats_season[0].steals_stats.total_steals += game_stats.steals;
                    stats_season[0].steals_stats.steals_per_minute += stats_season[0].steals_stats.total_steals / stats_season[0].time_played.minutes;
                    stats_season[0].steals_stats.steals_per_game += stats_season[0].steals_stats.total_steals / stats_season[0].games_played;

                    //Turnovers stats
                    stats_season[0].lost_balls_stats.total_losts += game_stats.turnovers;
                    stats_season[0].lost_balls_stats.turnovers_per_minute += stats_season[0].lost_balls_stats.total_losts / stats_season[0].time_played.minutes;

                    //Rebounds stats
                    stats_season[0].rebounds_stats.total_rebounds += game_stats.total_rebounds;
                    stats_season[0].rebounds_stats.average_rebounds = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].games_played;
                    stats_season[0].rebounds_stats.offensive_rebounds += game_stats.offensive_rebounds;
                    stats_season[0].rebounds_stats.defensive_rebounds += game_stats.defensive_rebounds;
                    stats_season[0].rebounds_stats.total_rebounds_per_minute = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].time_played.minutes;
                    stats_season[0].rebounds_stats.off_rebounds_per_minute = stats_season[0].rebounds_stats.offensive_rebounds / stats_season[0].time_played.minutes;
                    stats_season[0].rebounds_stats.def_rebounds_per_minute = stats_season[0].rebounds_stats.defensive_rebounds / stats_season[0].time_played.minutes;

                    //Blocks stats
                    stats_season[0].blocks_stats.total_blocks_made += game_stats.blocks_made;
                    stats_season[0].blocks_stats.total_blocks_received += game_stats.blocks_received;
                    stats_season[0].blocks_stats.blocks_made_per_game = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].games_played;
                    stats_season[0].blocks_stats.blocks_received_per_game = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].games_played;
                    stats_season[0].blocks_stats.blocks_made_per_minute = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].time_played.minutes;
                    stats_season[0].blocks_stats.blocks_received_per_minute = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].time_played.minutes;

                    //Foul stats
                    stats_season[0].fouls_stats.total_fouls_made += game_stats.fouls_made;
                    stats_season[0].fouls_stats.total_fouls_received += game_stats.fouls_received;
                    stats_season[0].fouls_stats.fouls_made_per_minute = stats_season[0].fouls_stats.total_fouls_made / game_stats.time_played.minutes;
                    stats_season[0].fouls_stats.fouls_received_per_minute = stats_season[0].fouls_stats.total_fouls_received / game_stats.time_played.minutes;

                    //Usage
                    stats_season[0].usage = (stats_season[0].usage + game_stats.usage) / stats_season[0].games_played;

                  }

                  this.player_stats_seasonService.updatePlayer_stats_season(stats_season[0]);

                })
                .catch( (err:HttpErrorResponse) => {
                  Swal.close();

                  Swal.fire({
                    title: 'Error al recibir las estadísticas por partido del jugador.',
                    icon: 'error'
                  });
                });
 

              })
              .catch( (err:HttpErrorResponse) => {
                Swal.close();

                Swal.fire({
                  title: 'Error al recibir las estadísticas de jugador de la base de datos.',
                  icon: 'error'
                });

              });

            }

            //Get the stats of the season for both teams

            //Home team stats
            this.team_stats_seasonService.getTeams_stats_season("?team_id="+this.home_team_stats.team_id+"&season="+this.home_team_stats.season+"&league_id="+this.home_team_stats.league_id).then( (stats_season:Team_stats_seasonModel[]) => {

              stats_season[0].time_played = {
                minutes: 0,
                seconds: 0,
              };
              stats_season[0].games_played = 0;
              stats_season[0].wins = 0;
              stats_season[0].losses = 0;
              stats_season[0].win_percentage = 0;
              stats_season[0].points_stats = {
                  total_points: 0,
                  average_points: 0,
                  points_per_minute: 0,
                  points_per_field_shot: 0,
                  points_per_shot_t2: 0,
                  points_per_shot_t3: 0,
                  points_per_possesion: 0,
              };
              stats_season[0].shots_stats = {
                  total_shots: 0,
                  total_FG_shots: 0,
                  shots_list: {
                      lc3: {made: 0, attempted: 0},
                      le3: {made: 0, attempted: 0},
                      c3: {made: 0, attempted: 0},
                      re3: {made: 0, attempted: 0},
                      rc3: {made: 0, attempted: 0},
                      lmc2: {made: 0, attempted: 0},
                      lme2: {made: 0, attempted: 0},
                      cm2: {made: 0, attempted: 0},
                      rme2: {made: 0, attempted: 0},
                      rmc2: {made: 0, attempted: 0},
                      lp2: {made: 0, attempted: 0},
                      rp2: {made: 0, attempted: 0},
                      lft2: {made: 0, attempted: 0},
                      rft2: {made: 0, attempted: 0}
                  },
                  eFG: 0,
                  fg_percentage: 0,
                  t2_stats: {
                      t2_made: 0,
                      t2_attempted: 0,
                      t2_total: 0,
                      t2_percentage: 0,
                      t2_volume_percentage: 0
                  },
                  t3_stats: {
                      t3_made: 0,
                      t3_attempted: 0,
                      t3_total: 0,
                      t3_percentage: 0,
                      t3_volume_percentage: 0,
                  },
                  t1_stats: {
                      t1_made: 0,
                      t1_attempted: 0,
                      t1_percentage: 0,
                      t1_volume_percentage: 0,
                  }
              };
              stats_season[0].assists_stats = {
                  total_assists: 0,
                  assists_percentage: 0,
                  assists_per_lost: 0
              };
              stats_season[0].steals_stats = {
                  total_steals: 0,
                  steals_per_minute: 0,
                  steals_per_game: 0
              };
              stats_season[0].lost_balls_stats = {
                  total_losts: 0,
                  turnovers_per_minute: 0
              };
              stats_season[0].rebounds_stats = {
                  total_rebounds: 0,
                  average_rebounds: 0,
                  offensive_rebounds: 0,
                  defensive_rebounds: 0,
                  total_rebounds_per_minute: 0,
                  off_rebounds_per_minute: 0,
                  def_rebounds_per_minute: 0
              };
              stats_season[0].blocks_stats = {
                  total_blocks_made: 0,
                  total_blocks_received: 0,
                  blocks_made_per_game: 0,
                  blocks_received_per_game: 0,
                  blocks_received_per_minute: 0,
                  blocks_made_per_minute: 0
              };
              stats_season[0].fouls_stats = {
                  total_fouls_made: 0,
                  fouls_made_per_minute: 0,
                  total_fouls_received: 0,
                  fouls_received_per_minute: 0
              }

              this.team_stats_gameService.getTeams_stats_game("?team_id="+this.home_team_stats.team_id+"&season="+this.home_team_stats.season+"&league_id="+this.home_team_stats.league_id).then( (stats_game:Team_stats_gameModel[]) => {

                for(let game_stats of stats_game){

                  //Update the time played through the season
                  if( (stats_season[0].time_played.seconds + game_stats.time_played.seconds) > 59){
                    stats_season[0].time_played.seconds = 0;
                    
                    game_stats.time_played.minutes += Math.ceil(game_stats.time_played.seconds / 60);
                    game_stats.time_played.seconds = game_stats.time_played.seconds % 60;
                  }
            
                  stats_season[0].time_played.minutes += game_stats.time_played.minutes;
                  stats_season[0].time_played.seconds += game_stats.time_played.seconds;
                  
                  //Update games played
                  stats_season[0].games_played++;

                  //Update shots stats
                    //Shots list
                  stats_season[0].shots_stats.shots_list.lc3.made += game_stats.shots_list.lc3.made;
                  stats_season[0].shots_stats.shots_list.lc3.attempted += game_stats.shots_list.lc3.attempted;

                  stats_season[0].shots_stats.shots_list.le3.made += game_stats.shots_list.le3.made;
                  stats_season[0].shots_stats.shots_list.le3.attempted += game_stats.shots_list.le3.attempted;

                  stats_season[0].shots_stats.shots_list.c3.made += game_stats.shots_list.c3.made;
                  stats_season[0].shots_stats.shots_list.c3.attempted += game_stats.shots_list.c3.attempted;

                  stats_season[0].shots_stats.shots_list.re3.made += game_stats.shots_list.re3.made;
                  stats_season[0].shots_stats.shots_list.re3.attempted += game_stats.shots_list.re3.attempted;

                  stats_season[0].shots_stats.shots_list.rc3.made += game_stats.shots_list.rc3.made;
                  stats_season[0].shots_stats.shots_list.rc3.attempted += game_stats.shots_list.rc3.attempted;

                  stats_season[0].shots_stats.shots_list.lmc2.made += game_stats.shots_list.lmc2.made;
                  stats_season[0].shots_stats.shots_list.lmc2.attempted += game_stats.shots_list.lmc2.attempted;

                  stats_season[0].shots_stats.shots_list.lme2.made += game_stats.shots_list.lme2.made;
                  stats_season[0].shots_stats.shots_list.lme2.attempted += game_stats.shots_list.lme2.attempted;

                  stats_season[0].shots_stats.shots_list.cm2.made += game_stats.shots_list.cm2.made;
                  stats_season[0].shots_stats.shots_list.cm2.attempted += game_stats.shots_list.cm2.attempted;

                  stats_season[0].shots_stats.shots_list.rme2.made += game_stats.shots_list.rme2.made;
                  stats_season[0].shots_stats.shots_list.rme2.attempted += game_stats.shots_list.rme2.attempted;

                  stats_season[0].shots_stats.shots_list.rmc2.made += game_stats.shots_list.rmc2.made;
                  stats_season[0].shots_stats.shots_list.rmc2.attempted += game_stats.shots_list.rmc2.attempted;

                  stats_season[0].shots_stats.shots_list.lp2.made += game_stats.shots_list.lp2.made;
                  stats_season[0].shots_stats.shots_list.lp2.attempted += game_stats.shots_list.lp2.attempted;

                  stats_season[0].shots_stats.shots_list.rp2.made += game_stats.shots_list.rp2.made;
                  stats_season[0].shots_stats.shots_list.rp2.attempted += game_stats.shots_list.rp2.attempted;

                  stats_season[0].shots_stats.shots_list.lft2.made += game_stats.shots_list.lft2.made;
                  stats_season[0].shots_stats.shots_list.lft2.attempted += game_stats.shots_list.lft2.attempted;

                  stats_season[0].shots_stats.shots_list.rft2.made += game_stats.shots_list.rft2.made;
                  stats_season[0].shots_stats.shots_list.rft2.attempted += game_stats.shots_list.rft2.attempted;

                    //Total shots
                  stats_season[0].shots_stats.total_shots += game_stats.t2_attempted + game_stats.t3_attempted + game_stats.t1_attempted;
                    //Total FG shots
                  stats_season[0].shots_stats.total_FG_shots += game_stats.t2_attempted + game_stats.t3_attempted;

                    //t2_stats
                  stats_season[0].shots_stats.t2_stats.t2_made += game_stats.t2_made;
                  stats_season[0].shots_stats.t2_stats.t2_attempted += game_stats.t2_attempted;
                  stats_season[0].shots_stats.t2_stats.t2_percentage = 100*(stats_season[0].shots_stats.t2_stats.t2_made / stats_season[0].shots_stats.t2_stats.t2_attempted);
                  stats_season[0].shots_stats.t2_stats.t2_volume_percentage = (stats_season[0].shots_stats.t2_stats.t2_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                    //t3_stats
                  stats_season[0].shots_stats.t3_stats.t3_made += game_stats.t3_made;
                  stats_season[0].shots_stats.t3_stats.t3_attempted += game_stats.t3_attempted;
                  stats_season[0].shots_stats.t3_stats.t3_percentage = 100*(stats_season[0].shots_stats.t3_stats.t3_made / stats_season[0].shots_stats.t3_stats.t3_attempted);
                  stats_season[0].shots_stats.t3_stats.t3_volume_percentage = (stats_season[0].shots_stats.t3_stats.t3_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                    //t1_stats
                  stats_season[0].shots_stats.t1_stats.t1_made += game_stats.t1_made;
                  stats_season[0].shots_stats.t1_stats.t1_attempted += game_stats.t1_attempted;
                  stats_season[0].shots_stats.t1_stats.t1_percentage = 100*(stats_season[0].shots_stats.t1_stats.t1_made / stats_season[0].shots_stats.t1_stats.t1_attempted);
                  stats_season[0].shots_stats.t1_stats.t1_volume_percentage = (stats_season[0].shots_stats.t1_stats.t1_attempted*100) / stats_season[0].shots_stats.total_shots;

                    //eFG
                  stats_season[0].shots_stats.eFG = 100*(stats_season[0].shots_stats.total_FG_shots + (stats_season[0].shots_stats.t3_stats.t3_made)*0.5 ) / stats_season[0].shots_stats.total_FG_shots;

                    //%FG
                  stats_season[0].shots_stats.fg_percentage = 100*( (stats_season[0].shots_stats.t2_stats.t2_made + stats_season[0].shots_stats.t3_stats.t3_made) / (stats_season[0].shots_stats.t2_stats.t2_attempted + stats_season[0].shots_stats.t3_stats.t3_attempted) );

                  //Update points stats
                  stats_season[0].points_stats.total_points += game_stats.points;
                  stats_season[0].points_stats.average_points = stats_season[0].points_stats.total_points / stats_season[0].games_played;
                  stats_season[0].points_stats.points_per_minute = stats_season[0].points_stats.total_points / stats_season[0].time_played.minutes;
                  stats_season[0].points_stats.points_per_field_shot = ( (stats_season[0].shots_stats.t2_stats.t2_made*2) + (stats_season[0].shots_stats.t3_stats.t3_made*3) ) / stats_season[0].shots_stats.total_FG_shots;
                  stats_season[0].points_stats.points_per_shot_t2 = (stats_season[0].shots_stats.t2_stats.t2_made*2) / stats_season[0].shots_stats.t2_stats.t2_attempted;
                  stats_season[0].points_stats.points_per_shot_t3 = (stats_season[0].shots_stats.t3_stats.t3_made*3) / stats_season[0].shots_stats.t3_stats.t3_attempted;

                  //Steals stats
                  stats_season[0].steals_stats.total_steals += game_stats.steals;
                  stats_season[0].steals_stats.steals_per_minute += stats_season[0].steals_stats.total_steals / stats_season[0].time_played.minutes;
                  stats_season[0].steals_stats.steals_per_game += stats_season[0].steals_stats.total_steals / stats_season[0].games_played;

                  //Turnovers stats
                  stats_season[0].lost_balls_stats.total_losts += game_stats.turnovers;
                  stats_season[0].lost_balls_stats.turnovers_per_minute += stats_season[0].lost_balls_stats.total_losts / stats_season[0].time_played.minutes;

                  //Rebounds stats
                  stats_season[0].rebounds_stats.total_rebounds += game_stats.total_rebounds;
                  stats_season[0].rebounds_stats.average_rebounds = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].games_played;
                  stats_season[0].rebounds_stats.offensive_rebounds += game_stats.offensive_rebounds;
                  stats_season[0].rebounds_stats.defensive_rebounds += game_stats.defensive_rebounds;
                  stats_season[0].rebounds_stats.total_rebounds_per_minute = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].time_played.minutes;
                  stats_season[0].rebounds_stats.off_rebounds_per_minute = stats_season[0].rebounds_stats.offensive_rebounds / stats_season[0].time_played.minutes;
                  stats_season[0].rebounds_stats.def_rebounds_per_minute = stats_season[0].rebounds_stats.defensive_rebounds / stats_season[0].time_played.minutes;

                  //Blocks stats
                  stats_season[0].blocks_stats.total_blocks_made += game_stats.blocks_made;
                  stats_season[0].blocks_stats.total_blocks_received += game_stats.blocks_received;
                  stats_season[0].blocks_stats.blocks_made_per_game = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].games_played;
                  stats_season[0].blocks_stats.blocks_received_per_game = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].games_played;
                  stats_season[0].blocks_stats.blocks_made_per_minute = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].time_played.minutes;
                  stats_season[0].blocks_stats.blocks_received_per_minute = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].time_played.minutes;

                  //Foul stats
                  stats_season[0].fouls_stats.total_fouls_made += game_stats.fouls_made;
                  stats_season[0].fouls_stats.total_fouls_received += game_stats.fouls_received;
                  stats_season[0].fouls_stats.fouls_made_per_minute = stats_season[0].fouls_stats.total_fouls_made / game_stats.time_played.minutes;
                  stats_season[0].fouls_stats.fouls_received_per_minute = stats_season[0].fouls_stats.total_fouls_received / game_stats.time_played.minutes;

                }

                this.team_stats_seasonService.updateTeam_stats_season(stats_season[0]);

              });

              

            });

            //Visitor team stats
            this.team_stats_seasonService.getTeams_stats_season("?team_id="+this.visitor_team_stats.team_id+"&season="+this.visitor_team_stats.season+"&league_id="+this.visitor_team_stats.league_id).then( (stats_season:Team_stats_seasonModel[]) => {

              stats_season[0].time_played = {
                minutes: 0,
                seconds: 0,
              };
              stats_season[0].games_played = 0;
              stats_season[0].wins = 0;
              stats_season[0].losses = 0;
              stats_season[0].win_percentage = 0;
              stats_season[0].points_stats = {
                  total_points: 0,
                  average_points: 0,
                  points_per_minute: 0,
                  points_per_field_shot: 0,
                  points_per_shot_t2: 0,
                  points_per_shot_t3: 0,
                  points_per_possesion: 0,
              };
              stats_season[0].shots_stats = {
                  total_shots: 0,
                  total_FG_shots: 0,
                  shots_list: {
                      lc3: {made: 0, attempted: 0},
                      le3: {made: 0, attempted: 0},
                      c3: {made: 0, attempted: 0},
                      re3: {made: 0, attempted: 0},
                      rc3: {made: 0, attempted: 0},
                      lmc2: {made: 0, attempted: 0},
                      lme2: {made: 0, attempted: 0},
                      cm2: {made: 0, attempted: 0},
                      rme2: {made: 0, attempted: 0},
                      rmc2: {made: 0, attempted: 0},
                      lp2: {made: 0, attempted: 0},
                      rp2: {made: 0, attempted: 0},
                      lft2: {made: 0, attempted: 0},
                      rft2: {made: 0, attempted: 0}
                  },
                  eFG: 0,
                  fg_percentage: 0,
                  t2_stats: {
                      t2_made: 0,
                      t2_attempted: 0,
                      t2_total: 0,
                      t2_percentage: 0,
                      t2_volume_percentage: 0
                  },
                  t3_stats: {
                      t3_made: 0,
                      t3_attempted: 0,
                      t3_total: 0,
                      t3_percentage: 0,
                      t3_volume_percentage: 0,
                  },
                  t1_stats: {
                      t1_made: 0,
                      t1_attempted: 0,
                      t1_percentage: 0,
                      t1_volume_percentage: 0,
                  }
              };
              stats_season[0].assists_stats = {
                  total_assists: 0,
                  assists_percentage: 0,
                  assists_per_lost: 0
              };
              stats_season[0].steals_stats = {
                  total_steals: 0,
                  steals_per_minute: 0,
                  steals_per_game: 0
              };
              stats_season[0].lost_balls_stats = {
                  total_losts: 0,
                  turnovers_per_minute: 0
              };
              stats_season[0].rebounds_stats = {
                  total_rebounds: 0,
                  average_rebounds: 0,
                  offensive_rebounds: 0,
                  defensive_rebounds: 0,
                  total_rebounds_per_minute: 0,
                  off_rebounds_per_minute: 0,
                  def_rebounds_per_minute: 0
              };
              stats_season[0].blocks_stats = {
                  total_blocks_made: 0,
                  total_blocks_received: 0,
                  blocks_made_per_game: 0,
                  blocks_received_per_game: 0,
                  blocks_received_per_minute: 0,
                  blocks_made_per_minute: 0
              };
              stats_season[0].fouls_stats = {
                  total_fouls_made: 0,
                  fouls_made_per_minute: 0,
                  total_fouls_received: 0,
                  fouls_received_per_minute: 0
              }

              this.team_stats_gameService.getTeams_stats_game("?team_id="+this.visitor_team_stats.team_id+"&season="+this.visitor_team_stats.season+"&league_id="+this.visitor_team_stats.league_id).then( (stats_game:Team_stats_gameModel[]) => {

                for(let game_stats of stats_game){

                  //Update the time played through the season
                  if( (stats_season[0].time_played.seconds + game_stats.time_played.seconds) > 59){
                    stats_season[0].time_played.seconds = 0;
                    
                    game_stats.time_played.minutes += Math.ceil(game_stats.time_played.seconds / 60);
                    game_stats.time_played.seconds = game_stats.time_played.seconds % 60;
                  }
            
                  stats_season[0].time_played.minutes += game_stats.time_played.minutes;
                  stats_season[0].time_played.seconds += game_stats.time_played.seconds;
                  
                  //Update games played
                  stats_season[0].games_played++;

                  //Update shots stats
                    //Shots list
                  stats_season[0].shots_stats.shots_list.lc3.made += game_stats.shots_list.lc3.made;
                  stats_season[0].shots_stats.shots_list.lc3.attempted += game_stats.shots_list.lc3.attempted;

                  stats_season[0].shots_stats.shots_list.le3.made += game_stats.shots_list.le3.made;
                  stats_season[0].shots_stats.shots_list.le3.attempted += game_stats.shots_list.le3.attempted;

                  stats_season[0].shots_stats.shots_list.c3.made += game_stats.shots_list.c3.made;
                  stats_season[0].shots_stats.shots_list.c3.attempted += game_stats.shots_list.c3.attempted;

                  stats_season[0].shots_stats.shots_list.re3.made += game_stats.shots_list.re3.made;
                  stats_season[0].shots_stats.shots_list.re3.attempted += game_stats.shots_list.re3.attempted;

                  stats_season[0].shots_stats.shots_list.rc3.made += game_stats.shots_list.rc3.made;
                  stats_season[0].shots_stats.shots_list.rc3.attempted += game_stats.shots_list.rc3.attempted;

                  stats_season[0].shots_stats.shots_list.lmc2.made += game_stats.shots_list.lmc2.made;
                  stats_season[0].shots_stats.shots_list.lmc2.attempted += game_stats.shots_list.lmc2.attempted;

                  stats_season[0].shots_stats.shots_list.lme2.made += game_stats.shots_list.lme2.made;
                  stats_season[0].shots_stats.shots_list.lme2.attempted += game_stats.shots_list.lme2.attempted;

                  stats_season[0].shots_stats.shots_list.cm2.made += game_stats.shots_list.cm2.made;
                  stats_season[0].shots_stats.shots_list.cm2.attempted += game_stats.shots_list.cm2.attempted;

                  stats_season[0].shots_stats.shots_list.rme2.made += game_stats.shots_list.rme2.made;
                  stats_season[0].shots_stats.shots_list.rme2.attempted += game_stats.shots_list.rme2.attempted;

                  stats_season[0].shots_stats.shots_list.rmc2.made += game_stats.shots_list.rmc2.made;
                  stats_season[0].shots_stats.shots_list.rmc2.attempted += game_stats.shots_list.rmc2.attempted;

                  stats_season[0].shots_stats.shots_list.lp2.made += game_stats.shots_list.lp2.made;
                  stats_season[0].shots_stats.shots_list.lp2.attempted += game_stats.shots_list.lp2.attempted;

                  stats_season[0].shots_stats.shots_list.rp2.made += game_stats.shots_list.rp2.made;
                  stats_season[0].shots_stats.shots_list.rp2.attempted += game_stats.shots_list.rp2.attempted;

                  stats_season[0].shots_stats.shots_list.lft2.made += game_stats.shots_list.lft2.made;
                  stats_season[0].shots_stats.shots_list.lft2.attempted += game_stats.shots_list.lft2.attempted;

                  stats_season[0].shots_stats.shots_list.rft2.made += game_stats.shots_list.rft2.made;
                  stats_season[0].shots_stats.shots_list.rft2.attempted += game_stats.shots_list.rft2.attempted;

                    //Total shots
                  stats_season[0].shots_stats.total_shots += game_stats.t2_attempted + game_stats.t3_attempted + game_stats.t1_attempted;
                    //Total FG shots
                  stats_season[0].shots_stats.total_FG_shots += game_stats.t2_attempted + game_stats.t3_attempted;

                    //t2_stats
                  stats_season[0].shots_stats.t2_stats.t2_made += game_stats.t2_made;
                  stats_season[0].shots_stats.t2_stats.t2_attempted += game_stats.t2_attempted;
                  stats_season[0].shots_stats.t2_stats.t2_percentage = 100*(stats_season[0].shots_stats.t2_stats.t2_made / stats_season[0].shots_stats.t2_stats.t2_attempted);
                  stats_season[0].shots_stats.t2_stats.t2_volume_percentage = (stats_season[0].shots_stats.t2_stats.t2_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                    //t3_stats
                  stats_season[0].shots_stats.t3_stats.t3_made += game_stats.t3_made;
                  stats_season[0].shots_stats.t3_stats.t3_attempted += game_stats.t3_attempted;
                  stats_season[0].shots_stats.t3_stats.t3_percentage = 100*(stats_season[0].shots_stats.t3_stats.t3_made / stats_season[0].shots_stats.t3_stats.t3_attempted);
                  stats_season[0].shots_stats.t3_stats.t3_volume_percentage = (stats_season[0].shots_stats.t3_stats.t3_attempted*100) / stats_season[0].shots_stats.total_FG_shots;

                    //t1_stats
                  stats_season[0].shots_stats.t1_stats.t1_made += game_stats.t1_made;
                  stats_season[0].shots_stats.t1_stats.t1_attempted += game_stats.t1_attempted;
                  stats_season[0].shots_stats.t1_stats.t1_percentage = 100*(stats_season[0].shots_stats.t1_stats.t1_made / stats_season[0].shots_stats.t1_stats.t1_attempted);
                  stats_season[0].shots_stats.t1_stats.t1_volume_percentage = (stats_season[0].shots_stats.t1_stats.t1_attempted*100) / stats_season[0].shots_stats.total_shots;

                    //eFG
                  stats_season[0].shots_stats.eFG = 100*(stats_season[0].shots_stats.total_FG_shots + (stats_season[0].shots_stats.t3_stats.t3_made)*0.5 ) / stats_season[0].shots_stats.total_FG_shots;

                    //%FG
                  stats_season[0].shots_stats.fg_percentage = 100*( (stats_season[0].shots_stats.t2_stats.t2_made + stats_season[0].shots_stats.t3_stats.t3_made) / (stats_season[0].shots_stats.t2_stats.t2_attempted + stats_season[0].shots_stats.t3_stats.t3_attempted) );

                  //Update points stats
                  stats_season[0].points_stats.total_points += game_stats.points;
                  stats_season[0].points_stats.average_points = stats_season[0].points_stats.total_points / stats_season[0].games_played;
                  stats_season[0].points_stats.points_per_minute = stats_season[0].points_stats.total_points / stats_season[0].time_played.minutes;
                  stats_season[0].points_stats.points_per_field_shot = ( (stats_season[0].shots_stats.t2_stats.t2_made*2) + (stats_season[0].shots_stats.t3_stats.t3_made*3) ) / stats_season[0].shots_stats.total_FG_shots;
                  stats_season[0].points_stats.points_per_shot_t2 = (stats_season[0].shots_stats.t2_stats.t2_made*2) / stats_season[0].shots_stats.t2_stats.t2_attempted;
                  stats_season[0].points_stats.points_per_shot_t3 = (stats_season[0].shots_stats.t3_stats.t3_made*3) / stats_season[0].shots_stats.t3_stats.t3_attempted;

                  //Steals stats
                  stats_season[0].steals_stats.total_steals += game_stats.steals;
                  stats_season[0].steals_stats.steals_per_minute += stats_season[0].steals_stats.total_steals / stats_season[0].time_played.minutes;
                  stats_season[0].steals_stats.steals_per_game += stats_season[0].steals_stats.total_steals / stats_season[0].games_played;

                  //Turnovers stats
                  stats_season[0].lost_balls_stats.total_losts += game_stats.turnovers;
                  stats_season[0].lost_balls_stats.turnovers_per_minute += stats_season[0].lost_balls_stats.total_losts / stats_season[0].time_played.minutes;

                  //Rebounds stats
                  stats_season[0].rebounds_stats.total_rebounds += game_stats.total_rebounds;
                  stats_season[0].rebounds_stats.average_rebounds = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].games_played;
                  stats_season[0].rebounds_stats.offensive_rebounds += game_stats.offensive_rebounds;
                  stats_season[0].rebounds_stats.defensive_rebounds += game_stats.defensive_rebounds;
                  stats_season[0].rebounds_stats.total_rebounds_per_minute = stats_season[0].rebounds_stats.total_rebounds / stats_season[0].time_played.minutes;
                  stats_season[0].rebounds_stats.off_rebounds_per_minute = stats_season[0].rebounds_stats.offensive_rebounds / stats_season[0].time_played.minutes;
                  stats_season[0].rebounds_stats.def_rebounds_per_minute = stats_season[0].rebounds_stats.defensive_rebounds / stats_season[0].time_played.minutes;

                  //Blocks stats
                  stats_season[0].blocks_stats.total_blocks_made += game_stats.blocks_made;
                  stats_season[0].blocks_stats.total_blocks_received += game_stats.blocks_received;
                  stats_season[0].blocks_stats.blocks_made_per_game = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].games_played;
                  stats_season[0].blocks_stats.blocks_received_per_game = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].games_played;
                  stats_season[0].blocks_stats.blocks_made_per_minute = stats_season[0].blocks_stats.total_blocks_made / stats_season[0].time_played.minutes;
                  stats_season[0].blocks_stats.blocks_received_per_minute = stats_season[0].blocks_stats.total_blocks_received / stats_season[0].time_played.minutes;

                  //Foul stats
                  stats_season[0].fouls_stats.total_fouls_made += game_stats.fouls_made;
                  stats_season[0].fouls_stats.total_fouls_received += game_stats.fouls_received;
                  stats_season[0].fouls_stats.fouls_made_per_minute = stats_season[0].fouls_stats.total_fouls_made / game_stats.time_played.minutes;
                  stats_season[0].fouls_stats.fouls_received_per_minute = stats_season[0].fouls_stats.total_fouls_received / game_stats.time_played.minutes;

                }

                this.team_stats_seasonService.updateTeam_stats_season(stats_season[0]);

              });

            });


            Swal.close();

          }
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
  updateUSG(team_index, player_index){
    let usg_1;
    let usg_2;

    let team_time_played;
    let player_time_played;

    if(team_index == 0){
      team_time_played = this.home_team_stats.time_played.minutes;
      player_time_played = this.home_players[player_index].time_played.minutes;

      if(team_time_played < 1){
        team_time_played = this.home_team_stats.time_played.seconds / 60;
      }
      if(player_time_played < 1){
        player_time_played = this.home_players[player_index].time_played.seconds / 60;
      }

    }
    else{
      team_time_played = this.visitor_team_stats.time_played.minutes;
      player_time_played = this.visitor_players[player_index].time_played.minutes;

      if(team_time_played < 1){
        team_time_played = this.visitor_team_stats.time_played.seconds / 60;
      }
      if(player_time_played < 1){
        player_time_played = this.visitor_players[player_index].time_played.seconds / 60;
      }

    }


    

    if(team_index == 0){

      usg_1 = 100*( (this.home_players[player_index].t2_attempted + this.home_players[player_index].t3_attempted) + 0.44*(this.home_players[player_index].t1_attempted) + (this.home_players[player_index].turnovers))*team_time_played;
      usg_2 = ( (this.home_team_stats.t2_attempted + this.home_team_stats.t3_attempted) + 0.44*(this.home_team_stats.t1_attempted) + this.home_team_stats.turnovers)*(player_time_played);

      this.home_players[player_index].usage = (usg_1 / usg_2);

    }
    else{
      usg_1 = 100*( (this.visitor_players[player_index].t2_attempted + this.visitor_players[player_index].t3_attempted) + 0.44*(this.visitor_players[player_index].t1_attempted) + (this.visitor_players[player_index].turnovers))*team_time_played;
      usg_2 = ( (this.visitor_team_stats.t2_attempted + this.visitor_team_stats.t3_attempted) + 0.44*(this.visitor_team_stats.t1_attempted) + this.visitor_team_stats.turnovers)*(player_time_played);
      
      this.visitor_players[player_index].usage = usg_1 / usg_2;
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

  setBenchPlayer(team_index, player_index){
    this.player_bench = [team_index, player_index];
  }

  substitution(){

    if( (this.player_active != [-1, -1] && this.bench_home_players != [-1,-1]) || (this.player_active != [-1, -1] && this.bench_visitor_players != [-1,-1]) ){

      this.pauseTimer();

      if(this.player_active[0] == this.player_bench[0]){
        let active_player_index;
        let bench_player_index;
  
        if(this.player_active[0] == 0){
          
          active_player_index = this.oncourt_home_players.indexOf(this.player_active[1]);
          bench_player_index = this.bench_home_players.indexOf(this.player_bench[1]);

          this.calculateTime(0, this.player_active[1], this.home_oncourt_timers[active_player_index]);
          this.home_oncourt_timers[active_player_index] = [this.quarter, this.minutes, this.seconds];

          this.updateUSG(0, this.player_active[1]);
  
          this.oncourt_home_players[active_player_index] = this.player_bench[1];
          this.bench_home_players[bench_player_index] = this.player_active[1];

          this.home_players[this.bench_home_players[bench_player_index]].starter = false;
          this.home_players[this.oncourt_home_players[active_player_index]].starter = true;

        }
        else{
          active_player_index = this.oncourt_visitor_players.indexOf(this.player_active[1]);
          bench_player_index = this.bench_visitor_players.indexOf(this.player_bench[1]);

          this.calculateTime(1, this.player_active[1], this.visitor_oncourt_timers[active_player_index]);
          this.visitor_oncourt_timers[active_player_index] = [this.quarter, this.minutes, this.seconds];

          this.updateUSG(1, this.player_active[1]);
  
          this.oncourt_visitor_players[active_player_index] = this.player_bench[1];
          this.bench_visitor_players[bench_player_index] = this.player_active[1];

          this.visitor_players[this.bench_visitor_players[bench_player_index]].starter = false;
          this.visitor_players[this.oncourt_visitor_players[active_player_index]].starter = true;
        }
  
        this.player_bench = [-1,-1];
        this.player_active = [-1,-1];
  
      }

    }

    

  }

}
