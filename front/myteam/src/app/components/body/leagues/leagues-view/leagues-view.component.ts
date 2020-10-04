import { Component, OnInit } from '@angular/core';

//Services
import { LeaguesService } from '../../../../services/leagues.service';

//Models
import {LeagueModel} from '../../../../models/league.model';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leagues-view',
  templateUrl: './leagues-view.component.html',
  styleUrls: ['./leagues-view.component.css']
})
export class LeaguesViewComponent implements OnInit {

  leagues: LeagueModel[] = [];

  constructor(private LeaguesService:LeaguesService, private route:ActivatedRoute) { 

    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

  }

  ngOnInit(): void {
    
    

  }


}
