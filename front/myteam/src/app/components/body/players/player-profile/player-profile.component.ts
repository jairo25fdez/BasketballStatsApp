import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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



@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  player:PlayerModel;

  constructor(private playersService:PlayersService, private route:ActivatedRoute) { 

    const player_id = this.route.snapshot.paramMap.get('id'); //Game ID

    this.playersService.getPlayer(player_id).then( (player:PlayerModel) => {
      this.player = player;
    });

  }

  ngOnInit(): void {
  }

}
