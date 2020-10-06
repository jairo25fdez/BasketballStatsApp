import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueModel } from 'src/app/models/league.model';
import { LeaguesService } from 'src/app/services/leagues.service';

@Component({
  selector: 'app-players-view',
  templateUrl: './players-view.component.html',
  styleUrls: ['./players-view.component.css']
})
export class PlayersViewComponent implements OnInit {

  form:FormGroup;
  leagues: LeagueModel[];
  clubs:any;
  teams:any;
  seasons:any;

  constructor( private fb:FormBuilder, private leaguesService:LeaguesService ) { 

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.createForm();

  }

  ngOnInit(): void {

    

  }

  createForm(){

    this.form = this.fb.group({
      leagues: [''],
      clubs: [''],
      teams: ['']
    });

  }

  setLeague(){
    //GET Clubs that play in the selected League
    console.log(this.form.get('leagues').value);
  }

}
