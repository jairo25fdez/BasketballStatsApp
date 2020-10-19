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

  /*
  plays:any[]= [
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    },
    {
      quarter: 4,
      time: "01:22",
      player: "J. Fernández",
      home_score: 40,
      visitor_score: 42,
      play_type: "Asistencia",
      player_img: "https://s.yimg.com/xe/i/us/sp/v/nba_cutout/players_l/10112019/3704.png",
      team_img: "https://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/171.png"
    }
  ]
  */

 plays:PlayModel[] = [];

  constructor(private playsService:PlaysService, private router:Router) { 


    const game_id = router.url.split('/')[2].toString();  //Game ID

    //Load the plays
    this.playsService.getPlays("?game_id="+game_id).then( (plays:PlayModel[]) => {
      this.plays = plays;

      console.log("PLAYS: "+JSON.stringify(this.plays));

    })
    .catch( (err:HttpErrorResponse) => {

    });

  }

  ngOnInit(): void {
  }

}
