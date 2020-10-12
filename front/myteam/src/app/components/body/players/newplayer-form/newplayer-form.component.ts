import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { PlayersService } from '../../../../services/players.service';
import { TeamsService } from '../../../../services/teams.service';
import { ImagesService } from '../../../../services/images.service';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';


@Component({
  selector: 'app-newplayer-form',
  templateUrl: './newplayer-form.component.html',
  styleUrls: ['./newplayer-form.component.css']
})
export class NewplayerFormComponent implements OnInit {

  formulario:FormGroup;
  clubs: ClubModel[];
  teams:TeamModel[];
  player:PlayerModel = new PlayerModel();
  

  club_selected:Boolean = false;
  selected_club_index:number;
  selected_team_index:number;
  selectedFile:File = null;

  constructor( private fb:FormBuilder, private leaguesService:LeaguesService, private imagesService:ImagesService, private clubsService:ClubsService, private teamsService:TeamsService, private playersService:PlayersService ) { 

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', [Validators.required]],
      primary_position: ['', [Validators.required] ],
      secondary_position: ['', ],
      phone: [''],
      weight: [''],
      height: [''],
      number: ['', Validators.required],
      league: ['', [Validators.required]],
      club: ['', [Validators.required]],
    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get emailNoValid(){
    return this.formulario.get('email').invalid && this.formulario.get('email').touched;
  }

  get lastnameNoValid(){
    return this.formulario.get('last_name').invalid && this.formulario.get('last_name').touched;
  }

  get birthdateNoValid(){
    return this.formulario.get('birth_date').invalid && this.formulario.get('birth_date').touched;
  }

  get primarypositionNoValid(){
    return this.formulario.get('primary_position').invalid && this.formulario.get('primary_position').touched;
  }

  get secondarypositionNoValid(){
    return this.formulario.get('secondary_position').invalid && this.formulario.get('secondary_position').touched;
  }

  get phoneNoValid(){
    return this.formulario.get('phone').invalid && this.formulario.get('phone').touched;
  }

  get clubNoValid(){
    return this.formulario.get('club').invalid && this.formulario.get('club').touched;
  }

  get leagueNoValid(){
    return this.formulario.get('league').invalid && this.formulario.get('league').touched;
  }

  get numberNoValid(){
    return this.formulario.get('number').invalid && this.formulario.get('number').touched;
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

  uploadImage(){
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);

    Swal.fire({
      title: 'Espere',
      text: 'Guardando imagen',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.imagesService.uploadImage(fd).then((res:any) => {
      
      if(res.status == 200){
        //Guardo la url en la propiedad correspondiente
        this.player.img = res.image_url;


        Swal.fire({
          title: 'Imagen subida correctamente.',
          icon: 'success'
        });

      
      }
      else{
        Swal.fire({
          title: 'Error al subir la imagen.',
          icon: 'error'
        });
      }
    });

  }

  selectClub(club_index){

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.teams = res;
    });

    this.selected_club_index = club_index;

    this.club_selected = true;

  }

  setLeague(team_index){ 

    let newClubInfo = {
      club_id: this.clubs[this.selected_club_index]._id,
      club_name: this.clubs[this.selected_club_index].name,
      club_img: this.clubs[this.selected_club_index].img,
      team_id: this.teams[team_index]._id,
      league_id: this.teams[team_index].league.league_id,
      league_name: this.teams[team_index].league.league_name,
      season: this.teams[team_index].season
    };
    

    this.player.teams[0] = newClubInfo;

  }

  guardar(){
    
    console.log("PLAYER: "+JSON.stringify(this.player));

    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{

      console.log("VALID FORM");

      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      });

      Swal.showLoading();

      this.playersService.createPlayer(this.player).then(resp => {
        console.log("ENTRO");
        //If the post success

        //Need to push the player in the selected team roster
        this.teamsService.getTeam(this.player.teams[0].team_id).then( (team:TeamModel) => {
          //Tengo el equipo, le hago el push de jugador al roster
          let newPlayer = {
            player_id: this.player._id,
            player_name: this.player.name,
            player_last_name: this.player.last_name,
            player_birth_date: this.player.birth_date,
            player_img: this.player.img,
            player_number: this.player.number,
            player_primary_position: this.player.primary_position
          };

          team.roster.push(newPlayer);

          this.teamsService.updateTeam(team).then( res => {

            Swal.fire({
              title: 'Jugador creado correctamente.',
              icon: 'success'
            });

          })
          .catch( (err:HttpErrorResponse) => {
            console.error('Ann error occurred: ', err.error);
            Swal.fire({
              title: 'Error al crear el jugador.',
              text: 'Compruebe que no existe un jugador con el mismo nombre y fecha de nacimiento.',
              icon: 'error'
            });
          });


        });
        
        

      });

    }

  }

}
