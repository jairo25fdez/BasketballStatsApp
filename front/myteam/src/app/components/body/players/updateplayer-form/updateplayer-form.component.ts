import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { TeamsService } from '../../../../services/teams.service';
import { PlayersService } from 'src/app/services/players.service';
import { ImagesService } from 'src/app/services/images.service';
import { Player_stats_gamesService } from '../../../../services/player_stats_game.service';
import { Player_stats_seasonService } from '../../../../services/player_stats_season.service';
import { PlaysService } from '../../../../services/plays.service';

//Models
import { ClubModel } from '../../../../models/club.model';
import { LeagueModel } from '../../../../models/league.model';
import { TeamModel } from '../../../../models/team.model';
import { PlayerModel } from 'src/app/models/player.model';
import { Player_stats_gameModel } from '../../../../models/player_stats_game.model';
import { Player_stats_seasonModel } from '../../../../models/player_stats_season.model';
import { PlayModel } from 'src/app/models/play.model';




@Component({
  selector: 'app-updateplayer-form',
  templateUrl: './updateplayer-form.component.html',
  styleUrls: ['./updateplayer-form.component.css']
})
export class UpdateplayerFormComponent implements OnInit {

  formulario:FormGroup;
  leagues;
  clubs: ClubModel[];
  teams: TeamModel[];
  player:PlayerModel = new PlayerModel();

  selectedFile:File = null;

  exists_img:boolean = false;

  selected_club_index:number;

  constructor( private fb:FormBuilder, private playsService:PlaysService, private players_stats_game:Player_stats_gamesService, private players_stats_season:Player_stats_seasonService, private LeaguesService:LeaguesService, private TeamsService:TeamsService, private ImagesService:ImagesService, private PlayersService:PlayersService, private route:ActivatedRoute, private ClubsService:ClubsService ) { 
    
    const id = this.route.snapshot.paramMap.get('id');

    this.PlayersService.getPlayer(id).then((res:PlayerModel) => {
      this.player = res;

      if(this.player.img != undefined){
        this.exists_img = true;
      }

      this.leagues = [{
        name: this.player.teams[0].league_name
      }];

      let league_index = 0;

      for(let league of this.leagues){

        if(league.name == this.player.teams[0].league_name){
          this.formulario.get('league').setValue(league_index);
        }
        league_index++;
        
      }

      this.ClubsService.getClubs().then((res:ClubModel[]) => {
        this.clubs = res;
  
        let club_index = 0;
  
        for(let club of this.clubs){
  
          if(club.name == this.player.teams[0].club_name){
            this.formulario.get('club').setValue(club_index);
          }
          club_index++;
  
        }
        
  
      });

    });

    /*
    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;

      let league_index = 0;

      for(let league of this.leagues){

        if(league.name == this.player.teams[0].league_name){
          this.formulario.get('league').setValue(league_index);
        }
        league_index++;
        
      }

    });
    */

    

    


    this.crearFormulario();

  }

  ngOnInit(): void {
    
  }

  crearFormulario(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', Validators.required],
      primary_position: ['', [Validators.required] ],
      secondary_position: ['', ],
      weight: [''],
      height: [''],
      number: [''],
      league: ['', Validators.required],
      club: ['', Validators.required]
    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get lastnameNoValid(){
    return this.formulario.get('last_name').invalid && this.formulario.get('last_name').touched;
  }

  get emailNoValid(){
    return this.formulario.get('email').invalid && this.formulario.get('email').touched;
  }

  get birthdateNoValid(){
    return this.formulario.get('birth_date').invalid && this.formulario.get('birth_date').touched;
  }

  get primarypositionNoValid(){
    return this.formulario.get('primary_position').invalid && this.formulario.get('primary_position').touched;
  }

  get leagueNoValid(){
    return this.formulario.get('league').invalid && this.formulario.get('league').touched;
  }

  get clubNoValid(){
    return this.formulario.get('club').invalid && this.formulario.get('club').touched;
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

    this.ImagesService.uploadImage(fd).then((res:any) => {
      
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

    this.TeamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.teams = res;

      this.leagues = [];
      for(let team of this.teams){

        let league = {
          name: team.league.league_name
        }

        this.leagues.push(league);

      }

    });

    this.selected_club_index = club_index;

    this.formulario.get('league').setValue('');


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

    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{

      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      });

      Swal.showLoading();

      this.PlayersService.updatePlayer(this.player).then(resp => {
        //If the post success

        //Update the players info in the teams
        this.TeamsService.getTeams("?roster.player_id="+this.player._id).then( (teams:TeamModel[]) => {

          for(let player of teams[0].roster){
            if(player.player_id == this.player._id){
              player.player_id = this.player._id;
              player.player_name = this.player.name;
              player.player_last_name = this.player.last_name;
              player.player_birth_date = this.player.birth_date;
              player.player_img = this.player.img;
              player.player_number = this.player.number;
              player.player_position = this.player.primary_position;
            }
          }

          //Update the team
          this.TeamsService.updateTeam(teams[0]).catch( (err:HttpErrorResponse) => {
            console.error("Error while trying to update the player in the team roster");
          });

        });

        //Update player info in the player_stats_game and playyer_stats_season
        this.players_stats_game.getPlayer_stats_games("?player_id="+this.player._id).then( (player_stats_games:Player_stats_gameModel[]) => {
          for(let player_stats of player_stats_games){
            player_stats.player_name = this.player.name;
            player_stats.player_lastName = this.player.last_name;
            player_stats.player_img = this.player.img;
            player_stats.player_number = this.player.number;

            this.players_stats_game.updatePlayer_stats_game(player_stats);
          }
        });

        this.players_stats_season.getPlayer_stats_seasons("?player_id="+this.player._id).then( (player_stats_seasons:Player_stats_seasonModel[]) => {
          for(let player_stats of player_stats_seasons){
            player_stats.player_name = this.player.name;
            player_stats.player_lastName = this.player.last_name;
            player_stats.player_img = this.player.img;

            this.players_stats_season.updatePlayer_stats_season(player_stats);
          }
        });

        this.playsService.getPlays("?player.player_id="+this.player._id).then( (player_plays:PlayModel[]) => {
          for(let play of player_plays){
            play.player.player_name = this.player.name;
            play.player.player_last_name = this.player.last_name;
            play.player.player_img = this.player.img;

            this.playsService.updatePlay(play);
          }
        });

        Swal.fire({
          title: 'Jugador actualizado correctamente.',
          icon: 'success'
        });

      })
      //If the post fails:
      .catch( (err: HttpErrorResponse) => {
        console.error('Ann error occurred: ', err.error);
        Swal.fire({
          title: 'Error al actualizar el jugador.',
          icon: 'error'
        });
      });

    }

  }


}
