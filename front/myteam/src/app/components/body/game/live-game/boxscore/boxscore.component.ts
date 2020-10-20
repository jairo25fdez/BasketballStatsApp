import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Services
import { Player_stats_gamesService } from 'src/app/services/player_stats_game.service';
import { Team_stats_gameService } from 'src/app/services/team_stats_game.service';
import { GamesService } from 'src/app/services/games.service';

//Models
import { PlayerModel } from 'src/app/models/player.model';
import { Player_stats_gameModel } from '../../../../../models/player_stats_game.model';
import { GameModel } from '../../../../../models/game.model';
import { Team_stats_gameModel } from '../../../../../models/team_stats_game.model';


@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html',
  styleUrls: ['./boxscore.component.css']
})
export class BoxscoreComponent implements OnInit {
  
  home_team_stats:Team_stats_gameModel;
  home_team_players_stats:Player_stats_gameModel[];

  visitor_team_stats:Team_stats_gameModel;
  visitor_team_players_stats:Player_stats_gameModel[];

  constructor( private gamesService:GamesService, private players_stats_gameService:Player_stats_gamesService, private team_stats_gameService:Team_stats_gameService, private router:Router) { 

    const game_id = router.url.split('/')[2].toString();  //Game ID

    this.gamesService.getGame(game_id).then( (game:GameModel) => {

      this.players_stats_gameService.getPlayer_stats_games("?game_id="+game_id+"&team_id="+game.home_team.team_id+"&sort=player_number").then( (player_stats:Player_stats_gameModel[]) => {
        this.home_team_players_stats = player_stats;
      });

      this.team_stats_gameService.getTeams_stats_game("?game_id="+game_id+"&team_id="+game.home_team.team_id).then ( (team_stats:Team_stats_gameModel) => {
        this.home_team_stats = team_stats;
      });

      this.players_stats_gameService.getPlayer_stats_games("?game_id="+game_id+"&team_id="+game.visitor_team.team_id+"&sort=player_number").then( (player_stats:Player_stats_gameModel[]) => {
        this.visitor_team_players_stats = player_stats;
      });

      this.team_stats_gameService.getTeams_stats_game("?game_id="+game_id+"&team_id="+game.visitor_team.team_id).then ( (team_stats:Team_stats_gameModel) => {
        this.visitor_team_stats = team_stats;
      });

    });

    

  }

  ngOnInit(): void {
  }

}
