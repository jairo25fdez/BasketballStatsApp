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
import { Player_stats_seasonModel } from '../../../../models/player_stats_season.model';

//Services
import { GamesService } from '../../../../services/games.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Player_stats_seasonService } from 'src/app/services/player_stats_season.service';
import { LeaguesService } from 'src/app/services/leagues.service';
import { ClubsService } from 'src/app/services/clubs.service';


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

  constructor(private fb:FormBuilder, private player_stats_seasonService:Player_stats_seasonService, private clubsService:ClubsService, private leaguesService:LeaguesService, private gamesService:GamesService, private team_stats_gameService:Team_stats_gameService, private player_stats_gameService:Player_stats_gamesService){ 
    this.gamesService.getGames().then( (games:GameModel[]) => {

      this.games = games;

     var dt = new Date(games[1].date);

     console.log(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear());

    });

    this.leaguesService.getLeagues("?sort=name").then( (leagues:LeagueModel[]) => {
      this.leagues = leagues;
    });

    this.clubsService.getClubs("?sort=name").then( (clubs:ClubModel[]) => {
      this.clubs = clubs;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){

    this.form = this.fb.group({
      leagues: [''],
      clubs: ['']
    });

  }

  searchGames(){
    this.gamesService.getGames("?league.league_id="+this.form.get('leagues').value+"&home_team.club_id="+this.form.get('clubs').value).then( (games:GameModel[]) => {
      this.games = games;
      this.gamesService.getGames("?league.league_id="+this.form.get('leagues').value+"&visitor_team.club_id="+this.form.get('clubs').value).then( (games:GameModel[]) => {
        for(let game of games){
          this.games.push(game);
        }
      });
    });
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

          this.player_stats_gameService.deletePlayer_stats_game(player_stats._id).then( () => {

            this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+player_stats.player_id+"&team_id="+player_stats.team_id+"&season="+player_stats.season).then( (stats_season:Player_stats_seasonModel[]) => {

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
              this.player_stats_gameService.getPlayer_stats_games("?player_id="+player_stats.player_id+"&team_id="+player_stats.team_id+"&season="+player_stats.season).then( (stats_game:Player_stats_gameModel[]) => {

                
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
            
          });
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
