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
import { reduceEachLeadingCommentRange } from 'typescript';

@Component({
  selector: 'app-teams-stats',
  templateUrl: './teams-stats.component.html',
  styleUrls: ['./teams-stats.component.css']
})
export class TeamsStatsComponent implements OnInit {

  teams_stats_chart:EChartOption;

  form:FormGroup;

  leagues:LeagueModel[];

  constructor(private fb:FormBuilder, private leaguesService:LeaguesService){

    this.createForm();
    
    this.leaguesService.getLeagues().then( (leagues:LeagueModel[]) => {
      this.leagues = leagues;
    });

    let chart_data = [
      //{name: "PRUEBA", value: [10.0, 8.04]},
      {name: "JAIRO", team:"NOMBRE EQUIPO",value: [0.0, 5.04]},
      {name: "PRUEBA 2", team:"SDFSD",value: [5.0, 3.04]},
      //[5.0, 3.04, "PRUEBA"]
    ];
    

    this.teams_stats_chart = {
      xAxis: [
        {
          type: 'value',
          axisLabel: {
            color: "white"
          }
      }],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            color: "white"
          }
      }],
      series: [{
          data: chart_data,
          type: 'scatter'
      }],
      tooltip: {
        //trigger: 'item',
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
            //type: 'line'
            //type: 'shadow'
        },
        //formatter: '{b0}: {c0}<br />{b1}: {c1}',
        formatter: function(params, ticket, callback) {
          console.log(params)
          //console.log("NOMBRE: "+params[0].data.name);
          //console.log("EQUIPO: "+params[0].data.team);

          let res = "<p class='text-center'>"+params[0].data.name+"</p>"+"<p class='text-center'>"+params[0].data.team+"</p><p>Percentil X: "+params[0].value[0]+"<p>Percentil Y: "+params[0].value[1];
          setTimeout(function() {
                    
            callback(ticket, res);

          }, 100)

          return 'loading';
        }
      },
    };

    

  }

  ngOnInit(): void {

  }

  createForm(){

    this.form = this.fb.group({
      leagues: ['',],
      teams: ['',]
    });

  }

}
