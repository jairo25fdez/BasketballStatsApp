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
import { Team_stats_seasonService } from '../../../../services/team_stats_season.service';

@Component({
  selector: 'app-team-profile',
  templateUrl: './team-profile.component.html',
  styleUrls: ['./team-profile.component.css']
})
export class TeamProfileComponent implements OnInit {

  team:TeamModel;

  form:FormGroup;
  form_heptagon:FormGroup;

  season_stats_heptagon:EChartOption;

  wins_percentage:number[] = [];
  ppfs:number[] = [];
  aspp:number[] = [];
  robpm:number[] = [];
  perpmin:number[] = [];
  rebpmin:number[] = [];
  eFG:number[] = [];

  ppfs_value:number;
  aspp_value:number;
  robpm_value:number;
  perpmin_value:number
  rebpmin_value:number;
  eFG_value:number;

  wins_percentage_counter:number = 0;
  ppfs_counter:number = 0;
  aspp_counter:number = 0;
  robpm_counter:number = 0;
  perpmin_counter:number = 0;
  rebpmin_counter:number = 0;
  eFG_counter:number = 0;

  team_stats:Team_stats_seasonModel;

  constructor(private route:ActivatedRoute, private fb:FormBuilder, private teamsService:TeamsService, private team_stats_season:Team_stats_seasonService){

    const team_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.teamsService.getTeam(team_id).then( (team:TeamModel) => {
      this.team = team;

      this.team_stats_season.getTeams_stats_season("?team_id="+this.team._id+"&season="+this.team.season).then( (team_stats:Team_stats_seasonModel[]) => {
        this.team_stats = team_stats[0];
        
        if(this.team_stats != undefined){

          this.team_stats_season.getTeams_stats_season("?season="+this.team_stats.season+"&league_id="+this.team_stats.league_id).then( (league_team_stats:Team_stats_seasonModel[]) => {
            

            for(let team_stats of league_team_stats){
              
              if(team_stats.win_percentage != null){
                this.wins_percentage.push(team_stats.win_percentage);
                this.wins_percentage_counter++;
              }
              if(team_stats.points_stats.points_per_field_shot != null){
                this.ppfs.push(team_stats.points_stats.points_per_field_shot);
                this.ppfs_counter++;
              }
              if(team_stats.assists_stats.assists_per_lost != null){
                this.aspp.push(team_stats.assists_stats.assists_per_lost);
                this.aspp_counter++;
              }
              if(team_stats.steals_stats.steals_per_minute != null){
                this.robpm.push(team_stats.steals_stats.steals_per_minute);
                this.robpm_counter++;
              }
              if(team_stats.lost_balls_stats.turnovers_per_minute != null){
                this.perpmin.push(team_stats.lost_balls_stats.turnovers_per_minute);
                this.perpmin_counter++;
              }
              if(team_stats.rebounds_stats.total_rebounds_per_minute != null){
                this.rebpmin.push(team_stats.rebounds_stats.total_rebounds_per_minute);
                this.rebpmin_counter++;
              }
              if(team_stats.shots_stats.eFG != null){
                this.eFG.push(team_stats.shots_stats.eFG);
                this.eFG_counter++;
              }

            }

            this.ppfs.sort(function(a, b){return a-b});
            this.aspp.sort(function(a, b){return a-b});
            this.robpm.sort(function(a, b){return a-b});
            this.perpmin.sort(function(a, b){return a-b});
            this.rebpmin.sort(function(a, b){return a-b});
            this.eFG.sort(function(a, b){return a-b});
  
            this.ppfs_value = ( (this.ppfs.lastIndexOf(this.team_stats.points_stats.points_per_field_shot)+1)*100) / this.ppfs_counter;
            this.aspp_value = ( (this.aspp.lastIndexOf(this.team_stats.assists_stats.assists_per_lost)+1)*100) / this.aspp_counter;
            this.robpm_value = ( (this.robpm.lastIndexOf(this.team_stats.steals_stats.steals_per_minute)+1)*100) / this.robpm_counter;
            this.perpmin_value = ( (this.perpmin.lastIndexOf(this.team_stats.lost_balls_stats.turnovers_per_minute)+1)*100) / this.perpmin_counter;
            this.rebpmin_value = ( (this.rebpmin.lastIndexOf(this.team_stats.rebounds_stats.total_rebounds_per_minute)+1)*100) / this.rebpmin_counter;
            this.eFG_value = ( (this.eFG.lastIndexOf(this.team_stats.shots_stats.eFG)+1)*100) / this.eFG_counter;


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
                        {text: 'RebPMin', max: 100}
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
                        value: [this.ppfs_value, this.aspp_value, this.eFG_value, this.robpm_value, this.perpmin_value, this.rebpmin_value],
                        name: this.team_stats.team_name
                      }
                    ]
                  }
              ]
        
            };

          });

        }
        

      });

    });

    this.createForm();

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
      leagues_heptagon: ['',],
      teams_heptagon: ['',],
      players_heptagon: ['',],
    });

  }

}
