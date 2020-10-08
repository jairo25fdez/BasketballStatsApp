import { Component, OnInit } from '@angular/core';

//Services
import { ClubsService } from '../../../../services/clubs.service';

//Models
import { ClubModel } from '../../../../models/club.model';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeagueModel } from 'src/app/models/league.model';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.css']
})
export class ClubsListComponent implements OnInit {

  form:FormGroup;
  clubs:ClubModel[];
  leagues:LeagueModel[];

  constructor(private ClubsService:ClubsService, private route:ActivatedRoute, private fb:FormBuilder) { 

    this.ClubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
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

  }

  deleteClub(club: ClubModel){


    Swal.fire({
      title: 'Espere',
      text: 'Borrando liga',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.ClubsService.deleteClub(club._id).then(res => {

      Swal.fire({
        title: 'Club borrado correctamente.',
        icon: 'success'
      });

      //Reload Leagues info when delete is successful
      this.ClubsService.getClubs().then((res:ClubModel[]) => {
        this.clubs = res;
      });

    })
    .catch( (err: HttpErrorResponse) => {
      console.error('Ann error occurred: ', err.error);
      Swal.fire({
        title: 'Error al borrar el club.',
        icon: 'error'
      });
    });


  }

}
