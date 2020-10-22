import { Component, OnInit } from '@angular/core';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { TeamModel } from 'src/app/models/team.model';
import { GameModel } from '../../../../../models/game.model';
import { PlayModel } from '../../../../../models/play.model';
import { Player_stats_gameModel } from '../../../../../models/player_stats_game.model';

//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { GamesService } from 'src/app/services/games.service';
import { PlaysService } from 'src/app/services/plays.service';
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-play-by-play',
  templateUrl: './play-by-play.component.html',
  styleUrls: ['./play-by-play.component.css']
})
export class PlayByPlayComponent implements OnInit {

 plays:PlayModel[] = [];
 game_id = "";

  constructor(private playsService:PlaysService, private router:Router) { 

    this.game_id = router.url.split('/')[2].toString();  //Game ID
    

  }

  ngOnInit(): void {

    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
      console.log("1");
    });
    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
      console.log("3");
    });
    //Load the plays
    this.playsService.getPlays("?game_id="+this.game_id+"&sort=period,time.minute,time.second,-home_team_score,-visitor_team_score").then( (plays:PlayModel[]) => {
      this.plays = plays;
      console.log("3");
    });

    

  }


}
