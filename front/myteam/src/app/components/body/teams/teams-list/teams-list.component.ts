import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

//Model
import { TeamModel } from '../../../../models/team.model';
import { LeagueModel } from 'src/app/models/league.model';
import { ClubModel } from '../../../../models/club.model';

//Services
import { TeamsService } from '../../../../services/teams.service';
import { LeaguesService } from '../../../../services/leagues.service';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.css']
})
export class TeamsListComponent implements OnInit {

  form:FormGroup;
  teams:TeamModel[];
  clubs:ClubModel[];
  leagues:LeagueModel[];

  constructor(private TeamsService:TeamsService, private LeaguesService:LeaguesService, private route:ActivatedRoute, private fb:FormBuilder) {

    this.TeamsService.getTeams().then((res:TeamModel[]) => {
      this.teams = res;
    });

    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){
    this.form = this.fb.group({
      leagues: [''],
      clubs: ['']
    });
  }


  setLeague(){

  }

}
