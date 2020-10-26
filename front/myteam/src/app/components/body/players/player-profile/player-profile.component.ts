import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EChartOption } from 'echarts';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { GameModel } from '../../../../models/game.model';
import { PlayModel } from '../../../../models/play.model';
import { Player_stats_gameModel } from '../../../../models/player_stats_game.model';
import { Team_stats_gameModel } from '../../../../models/team_stats_game.model';
import { Team_stats_seasonModel } from '../../../../models/team_stats_season.model';
import { Player_stats_seasonModel } from '../../../../models/player_stats_season.model';
import { PlayerModel } from 'src/app/models/player.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { GamesService } from 'src/app/services/games.service';
import { PlaysService } from 'src/app/services/plays.service';
import { PlayersService } from 'src/app/services/players.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Player_stats_seasonService } from 'src/app/services/player_stats_season.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';
import { Team_stats_seasonService } from 'src/app/services/team_stats_season.service';
import { NumericLiteral } from 'typescript';



@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  player:PlayerModel;
  player_stats:Player_stats_seasonModel;

  options:EChartOption;

  valor_prueba = 100;

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

  pptc_counter:number = 0;
  aspp_counter:number = 0;
  robpm_counter:number = 0;
  perpmin_counter:number = 0;
  rebpmin_counter:number = 0;


  constructor(private playersService:PlayersService, private player_stats_seasonService:Player_stats_seasonService, private route:ActivatedRoute) { 

    const player_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.playersService.getPlayer(player_id).then( (player:PlayerModel) => {
      this.player = player;

      this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+player._id+"&sort=-season").then( (player_stats:Player_stats_seasonModel[]) => {
        this.player_stats = player_stats[0];
  
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

          console.log(this.pptc);
  
          this.options = {
        
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
  
        });
  
      });
  
    });

    
  }

  ngOnInit(): void {

    

  }

}
