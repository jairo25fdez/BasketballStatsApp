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

  wins_percentage:number;

  team_stats:Team_stats_seasonModel;

  constructor(private route:ActivatedRoute, private fb:FormBuilder, private teamsService:TeamsService, private team_stats_season:Team_stats_seasonService){

    const team_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.teamsService.getTeam(team_id).then( (team:TeamModel) => {
      this.team = team;

      this.team_stats_season.getTeam_stats_season("?team_id="+this.team._id+"&season="+this.team.season).then( (team_stats:Team_stats_seasonModel) => {
        this.team_stats = team_stats;

        if(this.team_stats != undefined){
          this.team_stats_season.getTeams_stats_season("?season="+this.team_stats.season+"&league_id="+this.team_stats.league_id).then( (league_team_stats:Team_stats_seasonModel[]) => {
            
            for(let team_stats of league_team_stats){
              
              if(team_stats.points_stats.points_per_field_shot != null){
                //this.wins_percentage.push(team_stats.games_played / team_stats.win_percentage);
                //this.pptc_counter++;
              }
  
            }
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
