import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpClientModule } from '@angular/common/http'; //Http
//import { AppRoutingModule } from './app-routing.module';
import { APP_ROUTING } from './app-routing.module'; //Routes
import {ReactiveFormsModule} from '@angular/forms'; //Forms

//Services
import { LeaguesService } from './services/leagues.service';
import { ImagesService } from './services/images.service';
import { ClubsService } from './services/clubs.service';
import { TeamsService } from './services/teams.service';
import { PlayersService } from './services/players.service';
import { GamesService } from './services/games.service';
import { PlaysService } from './services/plays.service';


//Components

//Shared
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
//Games
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';
import { MainPageComponent } from './components/body/game/live-game/main-page/livegame-main-page';
import { BoxscoreComponent } from './components/body/game/live-game/boxscore/boxscore.component';
import { PlayByPlayComponent } from './components/body/game/live-game/play-by-play/play-by-play.component';
//Players
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';
import { PlayersMenuComponent } from './components/body/players/players-menu/players-menu.component';
import { PlayersViewComponent } from './components/body/players/players-view/players-view.component';
//Leagues
import { NewleagueFormComponent } from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';
import { LeaguesViewComponent } from './components/body/leagues/leagues-view/leagues-view.component';
//Clubs
import { ClubsMenuComponent } from './components/body/clubs/clubs-menu/clubs-menu.component';
import { ClubsListComponent } from './components/body/clubs/clubs-list/clubs-list.component';
import { NewclubFormComponent } from './components/body/clubs/newclub-form/newclub-form.component';
import { TeamsMenuComponent } from './components/body/teams/teams-menu/teams-menu.component';
import { TeamsListComponent } from './components/body/teams/teams-list/teams-list.component';
import { NewteamFormComponent } from './components/body/teams/newteam-form/newteam-form.component';
import { UpdateteamFormComponent } from './components/body/teams/updateteam-form/updateteam-form.component';
import { UpdateplayerFormComponent } from './components/body/players/updateplayer-form/updateplayer-form.component';
import { NewgameFormComponent } from './components/body/game/newgame-form/newgame-form.component';
import { GamesViewComponent } from './components/body/game/games-view/games-view.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    //Game Components
    LiveGameComponent,
    GameMenuComponent,
    MainPageComponent,
    BoxscoreComponent,
    PlayByPlayComponent,
    //Players components
    NewplayerFormComponent,
    PlayersMenuComponent,
    PlayersViewComponent,
    //Leagues components
    NewleagueFormComponent,
    LeaguesMenuComponent,
    LeaguesViewComponent,
    //Clubs components
    ClubsMenuComponent,
    ClubsListComponent,
    NewclubFormComponent,
    //Teams components
    TeamsMenuComponent,
    TeamsListComponent,
    NewteamFormComponent,
    UpdateteamFormComponent,
    UpdateplayerFormComponent,
    NewgameFormComponent,
    GamesViewComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    APP_ROUTING,
    //Forms
    ReactiveFormsModule,
    //Http
    HttpClientModule
  ],
  providers: [
    LeaguesService,
    ImagesService,
    ClubsService,
    TeamsService,
    PlayersService,
    GamesService,
    PlaysService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
