import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';


//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { PlayersService } from '../../../../services/players.service';
import { PlayerModel } from '../../../../models/player.model';

@Component({
  selector: 'app-newgame-form',
  templateUrl: './newgame-form.component.html',
  styleUrls: ['./newgame-form.component.css']
})
export class NewgameFormComponent implements OnInit {

  form:FormGroup;
  
  league_selected = false;

  leagues:LeagueModel[];
  clubs:ClubModel[];

  game_date:Date;

  selected_home_players = 0;
  selected_home_players_5i = 0;
  selected_visitor_players = 0;
  selected_visitor_players_5i = 0;

  //home_team_players:PlayerModel[];
  //visitor_team_players:PlayerModel[];
  home_team_players = [{
      name: "Jairo",
      last_name: "Fernández",
      number: 25
    },
    {
      name: "ASDAS",
      last_name: "Fernández"
    },
    {
      name: "Jairo",
      last_name: "Fernández"
    },
    {
      name: "ASDAS",
      last_name: "Fernández"
    },
    {
      name: "Jairo",
      last_name: "Fernández"
    },
    {
      name: "ASDAS",
      last_name: "Fernández"
    },
    {
      name: "Jairo",
      last_name: "Fernández"
    },
    {
      name: "ASDAS",
      last_name: "Fernández"
    },
  ];
  visitor_team_players = [];


  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private clubsService:ClubsService) {

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

   }

  ngOnInit(): void {
  }

  createForm(){

    this.form = this.fb.group({
      game_league: ['', [Validators.required] ],
      game_date: ['', ],
      season: ['', Validators.required]
    });

  }

  checkHomePlayers(event, checkBox) {

    if(checkBox == "home_player_5i"){
      if(event.target.checked === true){
        if(this.selected_home_players_5i < 5){
          this.selected_home_players_5i++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_home_players_5i>0){
        this.selected_home_players_5i--;
      }
    }
    else{
      if(event.target.checked === true){
        if(this.selected_home_players < 5){
          this.selected_home_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_home_players>0){
        this.selected_home_players--;
      }
    }

    
  }

  checkVisitorPlayers(event, checkBox) {

    if(checkBox == "visitor_player_5i"){
      if(event.target.checked === true){
        if(this.selected_visitor_players_5i < 5){
          this.selected_visitor_players_5i++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_visitor_players_5i>0){
        this.selected_visitor_players_5i--;
      }
    }
    else{
      if(event.target.checked === true){
        if(this.selected_visitor_players < 5){
          this.selected_visitor_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else if(this.selected_visitor_players>0){
        this.selected_visitor_players--;
      }
    }

    
  }

  guardar(){

  }

}
