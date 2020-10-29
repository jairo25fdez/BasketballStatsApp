import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EChartOption } from 'echarts';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { Team_stats_seasonService } from '../../../../services/team_stats_season.service';

@Component({
  selector: 'app-teams-stats',
  templateUrl: './teams-stats.component.html',
  styleUrls: ['./teams-stats.component.css']
})
export class TeamsStatsComponent implements OnInit {

  teams_stats_chart:EChartOption;

  form:FormGroup;

  leagues:LeagueModel[];
  teams_stats:Team_stats_seasonModel[];

  chart_data = [];
  data_x = []; //Save the ordered array with the stats of X axis.
  data_y = []; //Save the ordered array with the stats of Y axis.

  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private teams_stats_season:Team_stats_seasonService){

    this.createForm();

    this.leaguesService.getLeagues().then( (leagues:LeagueModel[]) => {
      this.leagues = leagues;
    });
    /*
    this.chart_data = [
      {name: "PRUEBA", value: [0,0]}
    ];
    */
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
          data: this.chart_data,
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
          //console.log(params)
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
      leagues: ['', [Validators.required]],
      //teams: ['',],
      axis_Y: ['',[Validators.required]],
      axis_X: ['',[Validators.required]]
    });

  }

  selectLeague(league_index){

    this.teams_stats_season.getTeams_stats_season("?league_id="+this.leagues[league_index]._id).then( (teams_stats:Team_stats_seasonModel[]) => {
      this.teams_stats = teams_stats;

    });

  }

  selectFilterX(filter){
    
    //Para empezar creo la lista ordenada de la estadística de X
    let array_filter = filter.split(".");
    let axis_x_data;
    let team_name = [];
    let team_data = [];
    let team_cont = 0;

    for(let team_stats of this.teams_stats){
      axis_x_data = team_stats;
      team_name.push(team_stats.team_name);
      for(let posicion of array_filter){
        axis_x_data = axis_x_data[posicion];
      }
      team_data.push(axis_x_data);
    }
    
    this.data_x = [...team_data];
    this.data_x.sort(function(a, b){return a-b});
    team_cont = this.data_x.length;
    
    for(let i = 0; i < team_name.length; i++){
      this.chart_data.push({
        name: team_name[i],
        value: [((this.data_x.lastIndexOf(team_data[i])+1)*100) / team_cont],
      });
    }

    //console.log(JSON.stringify(this.chart_data));
    
  }

  selectFilterY(filter){
    
    let array_filter = filter.split(".");
    let axis_y_data;
    let team_name = [];
    let team_data = [];
    let team_cont = 0;

    for(let team_stats of this.teams_stats){
      axis_y_data = team_stats;
      team_name.push(team_stats.team_name);
      for(let posicion of array_filter){
        axis_y_data = axis_y_data[posicion];
      }
      team_data.push(axis_y_data);
    }    

    this.data_y = [...team_data];
    this.data_y.sort(function(a, b){return a-b});
    team_cont = this.data_y.length;

    for(let i = 0; i < team_data.length; i++){
      var index = this.chart_data.findIndex(team_stats => team_stats.name == team_name[i]);

      this.chart_data[index].value.push( ((this.data_y.lastIndexOf(team_data[i])+1)*100) / team_cont );

    }

    //console.log(JSON.stringify(this.chart_data));

  }


  async submit(){

    if(this.form.valid){
      await this.selectFilterX(this.form.get('axis_X').value);
      await this.selectFilterY(this.form.get('axis_Y').value);

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
            data: this.chart_data,
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
            //console.log(params)
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

      this.data_x = []
      this.data_y = []
      this.chart_data = [];
    }

  }


}
