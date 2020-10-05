import { Component, OnInit } from '@angular/core';

//Services
import { LeaguesService } from '../../../../services/leagues.service';

//Models
import {LeagueModel} from '../../../../models/league.model';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-leagues-view',
  templateUrl: './leagues-view.component.html',
  styleUrls: ['./leagues-view.component.css']
})
export class LeaguesViewComponent implements OnInit {

  public leagues: LeagueModel[] = [];

  constructor(private LeaguesService:LeaguesService, private route:ActivatedRoute) { 

    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

  }

  ngOnInit(): void {

  }
  

  deleteLeague(league: LeagueModel){


    Swal.fire({
      title: 'Espere',
      text: 'Borrando liga',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.LeaguesService.deleteLeague(league._id).then(res => {

      Swal.fire({
        title: 'Liga borrada correctamente.',
        icon: 'success'
      });

      //Reload Leagues info when delete is successful
      this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
        this.leagues = res;
      });

    })
    .catch( (err: HttpErrorResponse) => {
      console.error('Ann error occurred: ', err.error);
      Swal.fire({
        title: 'Error al borrar la liga.',
        icon: 'error'
      });
    });


  }


}
