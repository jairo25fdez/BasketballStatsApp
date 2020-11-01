import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; //Http
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
import { Player_stats_gamesService } from './services/player_stats_game.service';
import { Player_stats_seasonService } from './services/player_stats_season.service';
import { Team_stats_gameService } from './services/team_stats_game.service';
import { Team_stats_seasonService } from './services/team_stats_season.service';

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
import { NewgameFormComponent } from './components/body/game/newgame-form/newgame-form.component';
import { GamesViewComponent } from './components/body/game/games-view/games-view.component';
//Players
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';
import { PlayersMenuComponent } from './components/body/players/players-menu/players-menu.component';
import { PlayersViewComponent } from './components/body/players/players-view/players-view.component';
import { UpdateplayerFormComponent } from './components/body/players/updateplayer-form/updateplayer-form.component';
import { PlayerProfileComponent } from './components/body/players/player-profile/player-profile.component';
//Leagues
import { NewleagueFormComponent } from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';
import { LeaguesViewComponent } from './components/body/leagues/leagues-view/leagues-view.component';
//Clubs
import { ClubsMenuComponent } from './components/body/clubs/clubs-menu/clubs-menu.component';
import { ClubsListComponent } from './components/body/clubs/clubs-list/clubs-list.component';
import { NewclubFormComponent } from './components/body/clubs/newclub-form/newclub-form.component';
//Teams
import { TeamsMenuComponent } from './components/body/teams/teams-menu/teams-menu.component';
import { TeamsListComponent } from './components/body/teams/teams-list/teams-list.component';
import { TeamProfileComponent } from './components/body/teams/team-profile/team-profile.component';
import { NewteamFormComponent } from './components/body/teams/newteam-form/newteam-form.component';
import { UpdateteamFormComponent } from './components/body/teams/updateteam-form/updateteam-form.component';
//Login
import { LoginService } from './services/login.service';

//Stats
import { StatsMenuComponent } from './components/body/stats/stats-menu/stats-menu.component';
import { PlayersStatsComponent } from './components/body/stats/players-stats/players-stats.component';
import { TeamsStatsComponent } from './components/body/stats/teams-stats/teams-stats.component';

//Charts
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MainComponent } from './components/body/main/main.component';
import { LoginComponent } from './components/body/login/login.component';

//Interceptor
import { AuthInterceptorService } from './services/authinterceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    //Game Components
    NewgameFormComponent,
    GamesViewComponent,
    LiveGameComponent,
    GameMenuComponent,
    MainPageComponent,
    BoxscoreComponent,
    PlayByPlayComponent,
    //Players components
    PlayerProfileComponent,
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
    TeamProfileComponent,
    TeamsMenuComponent,
    TeamsListComponent,
    NewteamFormComponent,
    UpdateteamFormComponent,
    UpdateplayerFormComponent,
    //Stats components
    StatsMenuComponent,
    TeamsStatsComponent,
    PlayersStatsComponent,
    MainComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    APP_ROUTING,
    //Forms
    ReactiveFormsModule,
    //Http
    HttpClientModule,
    //Charts
    NgxEchartsModule.forRoot({
      echarts
    })
  ],
  providers: [
    LeaguesService,
    ImagesService,
    ClubsService,
    TeamsService,
    PlayersService,
    GamesService,
    PlaysService,
    Player_stats_gamesService,
    Player_stats_seasonService,
    Team_stats_gameService,
    Team_stats_seasonService,
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
