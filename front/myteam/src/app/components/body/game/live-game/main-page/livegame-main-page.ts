import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { TeamModel } from 'src/app/models/team.model';
import { GameModel } from '../../../../../models/game.model';
import { PlayModel } from '../../../../../models/play.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { GamesService } from 'src/app/services/games.service';
import { PlaysService } from 'src/app/services/plays.service';



@Component({
  selector: 'app-livegame-main-page',
  templateUrl: './livegame-main-page.component.html',
  styleUrls: ['./livegame-main-page.component.css']
})
export class MainPageComponent implements OnInit {

  game:GameModel;

  home_team:TeamModel;
  visitor_team:TeamModel;

  oncourt_home_players:number[] = [];
  oncourt_visitor_players:number[] = [];

  player_active:number[] = [-1, -1];

  //Scoreboard
  quarter = 1;
  minutes = 10;
  seconds = 0;
  interval;


  constructor(private gamesService:GamesService, private playsService:PlaysService, private leaguesService:LeaguesService, private route:ActivatedRoute) { 

    const game_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.gamesService.getGame(game_id).then((res:GameModel) => {
      this.game = res;

      this.leaguesService.getLeague(this.game.league.league_id).then( (res:LeagueModel) => {
        this.minutes = res.quarter_length;
      });

      //Save home starters in an array.
      let cont = 0;
      for(let player of this.game.stats.home_team_stats.player_stats){
        if(player.starter){
          this.oncourt_home_players.push(cont);
        }

        cont++;
      }

      //Save visitor starters in an array.
      cont = 0;
      for(let player of this.game.stats.visitor_team_stats.player_stats){
        if(player.starter){
          this.oncourt_visitor_players.push(cont);
        }

        cont++;
      }

      

    });
    
    

  }

  ngOnInit(): void {
  }

  setPlayer(team_index, player_index){
    this.player_active = [team_index, player_index];
  }

  resumeTimer() {
    this.interval = setInterval(() => {

      if(this.seconds > 0){
        this.seconds--;
      }
      else{
        this.minutes--;
        this.seconds = 59;
      }

    },1000);

  }

  pauseTimer(){
    clearInterval(this.interval);
  }

  createFTPlay(shot_made){

    //Check if the user selected a player.
    if(this.player_active != [-1,-1]){
      let team_id;

      //Get the team's info
      if(this.player_active[0] == 0){
        team_id = this.game.home_team.team_id;
      }
      else{
        if(this.player_active[0] == 1){
          team_id = this.game.visitor_team.team_id;
        }
      }

      //Check if the FT was missed or not

      //Create the play
      let play = new PlayModel();
      play = {
        player: {
          player_id: this.game.stats.home_team_stats.player_stats[this.player_active[1]].player_id,
          player_name: this.game.stats.home_team_stats.player_stats[this.player_active[1]].player_name,
          player_last_name: this.game.stats.home_team_stats.player_stats[this.player_active[1]].player_lastName,
          player_img: this.game.stats.home_team_stats.player_stats[this.player_active[1]].player_img,
        },
        team: team_id,
        time: {
          minute: this.minutes,
          second: this.seconds
        },
        period: this.quarter,
        type: 'shot',
        shot_type: 'ft',
        shot_made: shot_made
      }

      this.playsService.createPlay(play).then( () => {

        //Update player stats
        if(this.player_active[0] == 0){
          this.game.stats.home_team_stats
        }
        else{
          
        }

        
        

      }) 
      .catch( (err:HttpErrorResponse) => {
        Swal.fire({
          title: 'Error al crear la jugada.',
          icon: 'error'
        });
      });

    }

  }

}
