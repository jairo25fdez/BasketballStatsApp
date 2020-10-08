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

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    LiveGameComponent,
    GameMenuComponent,
    MainPageComponent,
    BoxscoreComponent,
    PlayByPlayComponent,
    NewplayerFormComponent,
    NewleagueFormComponent,
    LeaguesMenuComponent,
    LeaguesViewComponent,
    PlayersMenuComponent,
    PlayersViewComponent,
    ClubsMenuComponent,
    ClubsListComponent,
    NewclubFormComponent,
    TeamsMenuComponent,
    TeamsListComponent,
    NewteamFormComponent
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
    TeamsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
