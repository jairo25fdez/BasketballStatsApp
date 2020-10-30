import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { EChartOption } from 'echarts';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { Player_stats_seasonModel } from '../../../../models/player_stats_season.model';


//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { Team_stats_seasonService } from '../../../../services/team_stats_season.service';
import { Player_stats_seasonService } from '../../../../services/player_stats_season.service';

@Component({
  selector: 'app-players-stats',
  templateUrl: './players-stats.component.html',
  styleUrls: ['./players-stats.component.css']
})
export class PlayersStatsComponent implements OnInit {

  players_stats_chart:EChartOption;

  form:FormGroup;
  axis_Y;
  axis_X;

  leagues:LeagueModel[];
  players_stats:Player_stats_seasonModel[];

  chart_data = [];
  data_x = []; //Save the ordered array with the stats of X axis.
  data_y = []; //Save the ordered array with the stats of Y axis.

  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private players_stats_season:Player_stats_seasonService) { 

    this.createForm();

    this.leaguesService.getLeagues().then( (leagues:LeagueModel[]) => {
      this.leagues = leagues;
    });

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

    this.players_stats_season.getPlayer_stats_seasons("?league_id="+this.leagues[league_index]._id).then( (players_stats:Player_stats_seasonModel[]) => {
      this.players_stats = players_stats;
    });

  }

  selectFilterX(filter){
    
    let array_filter = filter.split(".");
    let axis_x_data;
    let player_name = [];
    let player_data = [];
    let player_cont = 0;

    for(let player_stats of this.players_stats){
      axis_x_data = player_stats;
      player_name.push(player_stats.player_name+" "+player_stats.player_lastName);
      for(let posicion of array_filter){
        axis_x_data = axis_x_data[posicion];
      }
      player_data.push(axis_x_data);
    }
    
    this.data_x = [...player_data];
    this.data_x.sort(function(a, b){return a-b});
    player_cont = this.data_x.length;
    
    for(let i = 0; i < player_name.length; i++){
      this.chart_data.push({
        name: player_name[i],
        value: [((this.data_x.lastIndexOf(player_data[i])+1)*100) / player_cont],
      });
    }

    //console.log(JSON.stringify(this.chart_data));
    
  }

  selectFilterY(filter){
    
    let array_filter = filter.split(".");
    let axis_y_data;
    let player_name = [];
    let player_data = [];
    let player_cont = 0;

    for(let player_stats of this.players_stats){
      axis_y_data = player_stats;
      player_name.push(player_stats.player_name+" "+player_stats.player_lastName);
      for(let posicion of array_filter){
        axis_y_data = axis_y_data[posicion];
      }
      player_data.push(axis_y_data);
    }    

    this.data_y = [...player_data];
    this.data_y.sort(function(a, b){return a-b});
    player_cont = this.data_y.length;

    for(let i = 0; i < player_data.length; i++){
      var index = this.chart_data.findIndex(team_stats => team_stats.name == player_name[i]);

      this.chart_data[index].value.push( ((this.data_y.lastIndexOf(player_data[i])+1)*100) / player_cont );

    }

    //console.log(JSON.stringify(this.chart_data));

  }

  async submit(){

    if(this.form.valid){
      await this.selectFilterX(this.form.get('axis_X').value);
      await this.selectFilterY(this.form.get('axis_Y').value);

      this.players_stats_chart = {
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
          trigger: 'item',
          //trigger: 'axis',
          axisPointer: {
              type: 'cross'
              //type: 'line'
              //type: 'shadow'
          },
          formatter: function(params, ticket, callback) {
            //If trigger:axis ---->
            //let res = "<p class='text-center'>"+params[0].data.name+"</p><p>Percentil X: "+params[0].value[0]+"<p>Percentil Y: "+params[0].value[1];
            //If trigger:item --->
            let res = "<p class='text-center'>"+params.data.name+"</p><p>Percentil X: "+params.data.value[0]+"<p>Percentil Y: "+params.data.value[1];
            
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
