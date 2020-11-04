import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Model
import { TeamModel } from '../../../../models/team.model';
import { LeagueModel } from 'src/app/models/league.model';
import { ClubModel } from '../../../../models/club.model';

//Services
import { TeamsService } from '../../../../services/teams.service';
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';


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

  constructor(private router:Router, private TeamsService:TeamsService, private LeaguesService:LeaguesService,  private ClubsService:ClubsService, private route:ActivatedRoute, private fb:FormBuilder) {

    this.TeamsService.getTeams().then((res:TeamModel[]) => {
      this.teams = res;
    });

    this.LeaguesService.getLeagues("?sort=name").then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.ClubsService.getClubs("?sort=name").then( (clubs:ClubModel[]) => {
      this.clubs = clubs;
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


  searchTeams(){
    this.TeamsService.getTeams("?league.league_id="+this.form.get('leagues').value+"&club.club_id="+this.form.get('clubs').value).then( (teams:TeamModel[]) => {
      this.teams = teams;
    });
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

      //Reload teams when delete is successful
      this.TeamsService.getTeams().then((res:TeamModel[]) => {
        this.router.navigateByUrl('/home/teams/teams-list');
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
