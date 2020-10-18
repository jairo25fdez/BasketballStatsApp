import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';
import { GameModel } from '../../../../../models/game.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { ClubsService } from 'src/app/services/clubs.service';
import { PlayersService } from 'src/app/services/players.service';
import { TeamsService } from 'src/app/services/teams.service';
import { GamesService } from 'src/app/services/games.service';



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
  seconds = 59;
  interval;


  constructor(private gamesService:GamesService, private teamsService:TeamsService, private playersService:PlayersService, private route:ActivatedRoute) { 

    const game_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.gamesService.getGame(game_id).then((res:GameModel) => {
      this.game = res;

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

}
