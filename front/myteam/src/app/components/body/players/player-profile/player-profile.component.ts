import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EChartOption } from 'echarts';

import { FormBuilder, FormGroup } from '@angular/forms';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { GameModel } from '../../../../models/game.model';
import { PlayModel } from '../../../../models/play.model';
import { Player_stats_gameModel } from '../../../../models/player_stats_game.model';
import { Team_stats_gameModel } from '../../../../models/team_stats_game.model';
import { Team_stats_seasonModel } from '../../../../models/team_stats_season.model';
import { Player_stats_seasonModel } from '../../../../models/player_stats_season.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from '../../../../models/team.model';


//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { TeamsService } from 'src/app/services/teams.service';
import { PlayersService } from 'src/app/services/players.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Player_stats_seasonService } from 'src/app/services/player_stats_season.service';




@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  player:PlayerModel;
  player_stats:Player_stats_seasonModel;
  player_stats_season:Player_stats_seasonModel[];

  player_teams:any = [];

  season_stats_heptagon:EChartOption;
  season_stats_heptagon_comparator:EChartOption;
  total_shots_volume_pie:EChartOption;
  FG_shots_volume_pie:EChartOption;


  pptc:number[] = [];
  aspp:number[] = [];
  efg:number[] = [];
  robpm:number[] = [];
  perpmin:number[] = [];
  rebpmin:number[] = [];
  uso:number[] = [];

  pptc_value:number;
  aspp_value:number;
  robpm_value:number;
  perpmin_value:number;
  rebpmin_value:number;

  //Second player comparator stats
  second_player_pptc_value:number;
  second_player_aspp_value:number;
  second_player_robpm_value:number;
  second_player_perpmin_value:number;
  second_player_rebpmin_value:number;

  pptc_counter:number = 0;
  aspp_counter:number = 0;
  robpm_counter:number = 0;
  perpmin_counter:number = 0;
  rebpmin_counter:number = 0;

  form:FormGroup;
  form_heptagon:FormGroup;

  form_leagues:LeagueModel[];
  league_id:string;
  form_teams:TeamModel[];
  form_players_stats:Player_stats_seasonModel;
  second_player_stats:Player_stats_seasonModel;

  form_leagues_heptagon:LeagueModel[];
  league_id_heptagon:string;
  form_teams_heptagon:TeamModel[];
  form_players_stats_heptagon:Player_stats_seasonModel;
  second_player_stats_heptagon:Player_stats_seasonModel;

  season_stats_view = false;

  constructor(private fb:FormBuilder, private playersService:PlayersService, private leaguesService:LeaguesService, private teamsService:TeamsService, private player_stats_seasonService:Player_stats_seasonService, private route:ActivatedRoute) { 

    const player_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.playersService.getPlayer(player_id).then( (player:PlayerModel) => {
      this.player = player;

      this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+player._id+"&sort=-season").then( (player_stats:Player_stats_seasonModel[]) => {
        this.player_stats = player_stats[0]; //Save the last season stats
        this.player_stats_season = player_stats; //Save the stats of every season

        if(this.player_stats != undefined){
          this.player_stats_seasonService.getPlayer_stats_seasons("?league_id="+player_stats[0].league_id+"&season="+player_stats[0].season).then( (league_players_stats:Player_stats_seasonModel[]) => {
            //For each player we get the stats that we want to show
            for(let player_stats of league_players_stats){
              
              if(player_stats.points_stats.points_per_field_shot != null){
                this.pptc.push(player_stats.points_stats.points_per_field_shot);
                this.pptc_counter++;
              }
              if(player_stats.assists_stats.assists_per_lost != null){
                this.aspp.push(player_stats.assists_stats.assists_per_lost);
                this.aspp_counter++;
              }
              if(player_stats.steals_stats.steals_per_minute != null){
                this.robpm.push(player_stats.steals_stats.steals_per_minute);
                this.robpm_counter++;
              }
              if(player_stats.lost_balls_stats.turnovers_per_minute != null){
                this.perpmin.push(player_stats.lost_balls_stats.turnovers_per_minute);
                this.perpmin_counter++;
              }
              if(player_stats.rebounds_stats.total_rebounds_per_minute != null){
                this.rebpmin.push(player_stats.rebounds_stats.total_rebounds_per_minute);
                this.rebpmin_counter++;
              }
  
            }
  
            this.pptc.sort(function(a, b){return a-b});
            this.aspp.sort(function(a, b){return a-b});
            this.robpm.sort(function(a, b){return a-b});
            this.perpmin.sort(function(a, b){return a-b});
            this.rebpmin.sort(function(a, b){return a-b});

            /*
            this.pptc = [...new Set(this.pptc)];
            this.aspp = [...new Set(this.aspp)];
            //[...new Set(this.efg)];
            this.robpm = [...new Set(this.robpm)];
            this.perpmin = [...new Set(this.perpmin)];
            this.rebpmin = [...new Set(this.rebpmin)];
            //[...new Set(this.uso)];
            */
  
            this.pptc_value = ( (this.pptc.lastIndexOf(this.player_stats.points_stats.points_per_field_shot)+1)*100) / this.pptc_counter;
            this.aspp_value = ( (this.aspp.lastIndexOf(this.player_stats.assists_stats.assists_per_lost)+1)*100) / this.aspp_counter;
            this.robpm_value = ( (this.robpm.lastIndexOf(this.player_stats.steals_stats.steals_per_minute)+1)*100) / this.robpm_counter;
            this.perpmin_value = ( (this.perpmin.lastIndexOf(this.player_stats.lost_balls_stats.turnovers_per_minute)+1)*100) / this.perpmin_counter;
            this.rebpmin_value = ( (this.rebpmin.lastIndexOf(this.player_stats.rebounds_stats.total_rebounds_per_minute)+1)*100) / this.rebpmin_counter;
    
            this.season_stats_heptagon = {
          
              title: {
                text: ''
              },
              tooltip: {
                  trigger: 'axis'
              },
              radar: [
                  {
                    indicator: [
                        {text: 'PPTC', max: 100},
                        {text: 'ASPPer', max: 100},
                        {text: 'eFG%', max: 150},
                        {text: 'RobPMin', max: 100},
                        {text: 'PérPMin', max: 100},
                        {text: 'RebPMin', max: 100},
                        {text: '%Uso', max: 100}
                    ],
                    radius: ["0%", "70%"] //Chart width
                  }
              ],
              series: [
                  {
                    type: 'radar',
                    tooltip: {
                        trigger: 'item'
                    },
                    areaStyle: {},
                    data: [
                      {
                        value: [this.pptc_value, this.aspp_value, this.player_stats.shots_stats.eFG, this.robpm_value, this.perpmin_value, this.rebpmin_value, this.player_stats.usage],
                        name: this.player_stats.player_name+" "+this.player_stats.player_lastName
                      }
                    ]
                  }
              ]
        
            };

            this.total_shots_volume_pie = {
              title: {
                  text: '% de volumen de tiro por tipo',
                  textStyle: {
                    color: "white"
                  },
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              series: [
                  {
                    name: this.player_stats_season[0].player_name+" "+this.player_stats_season[0].player_lastName,
                    type: 'pie',
                    data: [
                      {
                        value: this.player_stats_season[0].shots_stats.t1_stats.t1_attempted,
                        name: "T1"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.t2_stats.t2_attempted,
                        name: "T2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.t3_stats.t3_attempted,
                        name: "T3"
                      }
                    ]
                  }
              ]
            };

            this.FG_shots_volume_pie = {
              title: {
                  text: '% de volumen de tiro por zona',
                  textStyle: {
                    color: "white"
                  },
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              series: [
                  {
                    name: this.player_stats_season[0].player_name+" "+this.player_stats_season[0].player_lastName,
                    type: 'pie',
                    data: [
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.lc3.attempted,
                        name: "LC3"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.le3.attempted,
                        name: "LE3"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.c3.attempted,
                        name: "C3"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.re3.attempted,
                        name: "RE3"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.rc3.attempted,
                        name: "RC3"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.lmc2.attempted,
                        name: "LMC2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.lme2.attempted,
                        name: "LME2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.cm2.attempted,
                        name: "CM2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.rme2.attempted,
                        name: "RME2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.rmc2.attempted,
                        name: "RMC2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.lp2.attempted,
                        name: "LP2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.rp2.attempted,
                        name: "RP2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.lft2.attempted,
                        name: "LFT2"
                      },
                      {
                        value: this.player_stats_season[0].shots_stats.shots_list.rft2.attempted,
                        name: "RFT2"
                      },
                    ]
                  }
              ]
            };
    
          });
    
        }

        for(let season_stats of this.player_stats_season){
          this.teamsService.getTeam(season_stats.team_id).then( (team:TeamModel) => {
            this.player_teams.push([team.club.club_name, team.league.league_name]);
          });

        }

        
      });
  
    });

    this.createForm();

    this.leaguesService.getLeagues("?sort=name").then( (leagues:LeagueModel[]) => {
      this.form_leagues = leagues;
      this.form_leagues_heptagon = leagues;
    });

  }

  ngOnInit(): void {

    

  }

  createForm(){

    this.form = this.fb.group({
      leagues: ['',],
      teams: ['',],
      players: ['',],
    });

    this.form_heptagon = this.fb.group({
      leagues: ['',],
      teams: ['',],
      players: ['',],
    });

  }

  selectLeague(league_id, heptagon=false){

    this.league_id = league_id;

    this.teamsService.getTeams("?season="+this.player_stats.season+"&league.league_id="+league_id+"&sort=club.club_name").then( (teams:TeamModel[]) => {
      if(!heptagon){
        this.form_teams = teams;
      }
      else{
        this.form_teams_heptagon = teams;
      }
    });

  }

  selectTeam(team_id, heptagon=false){

    this.player_stats_seasonService.getPlayer_stats_seasons("?season="+this.player_stats.season+"&league_id="+this.league_id+"&team_id="+team_id+"&sort=player_name").then( (player_stats:Player_stats_seasonModel) => {
      if(!heptagon){
        this.form_players_stats = player_stats;
      }
      else{
        this.form_players_stats_heptagon = player_stats;
      }
    });

  }

  selectPlayerStats(player_stats_index, heptagon=false){

    if(heptagon){
      
      this.second_player_stats_heptagon = this.form_players_stats_heptagon[player_stats_index];
      
        this.second_player_pptc_value = ( (this.pptc.lastIndexOf(this.second_player_stats_heptagon.points_stats.points_per_field_shot)+1)*100) / this.pptc_counter;
        this.second_player_aspp_value = ( (this.aspp.lastIndexOf(this.second_player_stats_heptagon.assists_stats.assists_per_lost)+1)*100) / this.aspp_counter;
        this.second_player_robpm_value = ( (this.robpm.lastIndexOf(this.second_player_stats_heptagon.steals_stats.steals_per_minute)+1)*100) / this.robpm_counter;
        this.second_player_perpmin_value = ( (this.perpmin.lastIndexOf(this.second_player_stats_heptagon.lost_balls_stats.turnovers_per_minute)+1)*100) / this.perpmin_counter;
        this.second_player_rebpmin_value = ( (this.rebpmin.lastIndexOf(this.second_player_stats_heptagon.rebounds_stats.total_rebounds_per_minute)+1)*100) / this.rebpmin_counter;

        this.season_stats_heptagon_comparator = {
      
          title: {
            text: ''
          },
          tooltip: {
              trigger: 'axis'
          },
          radar: [
              {
                indicator: [
                    {text: 'PPTC', max: 100},
                    {text: 'ASPPer', max: 100},
                    {text: 'eFG%', max: 150},
                    {text: 'RobPMin', max: 100},
                    {text: 'PérPMin', max: 100},
                    {text: 'RebPMin', max: 100},
                    {text: '%Uso', max: 100}
                ],
                radius: ["0%", "80%"] //Chart width
              }
          ],
          series: [
              {
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                areaStyle: {},
                data: [
                  {
                    value: [this.pptc_value, this.aspp_value, this.player_stats.shots_stats.eFG, this.robpm_value, this.perpmin_value, this.rebpmin_value, this.player_stats.usage],
                    name: this.player_stats.player_name+" "+this.player_stats.player_lastName
                  },
                  {
                    value: [this.second_player_pptc_value, this.second_player_aspp_value, this.second_player_stats.shots_stats.eFG, this.second_player_robpm_value, this.second_player_perpmin_value, this.second_player_rebpmin_value, this.second_player_stats.usage],
                    name: this.second_player_stats.player_name+" "+this.second_player_stats.player_lastName
                  }
                ],
                color: ['#c23531', 'yellow']
              }
          ]
    
        };

    }
    else{
      this.second_player_stats = this.form_players_stats[player_stats_index];
    }

  }


}
