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
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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

  deleteTeam(team: TeamModel){


    Swal.fire({
      title: 'Espere',
      text: 'Borrando equipo...',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.TeamsService.deleteTeam(team._id).then(res => {

      Swal.fire({
        title: 'Equipo borrado correctamente.',
        icon: 'success'
      });

      //Reload Leagues info when delete is successful
      this.TeamsService.getTeams().then((res:TeamModel[]) => {
        this.teams = res;
      });

    })
    .catch( (err: HttpErrorResponse) => {
      console.error('Ann error occurred: ', err.error);
      Swal.fire({
        title: 'Error al borrar el equipo.',
        icon: 'error'
      });
    });


  }

}
