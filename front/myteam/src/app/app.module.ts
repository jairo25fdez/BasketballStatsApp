import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpClientModule } from '@angular/common/http'; //Http
//import { AppRoutingModule } from './app-routing.module';
import { APP_ROUTING } from './app-routing.module'; //Routes
import {ReactiveFormsModule} from '@angular/forms'; //Forms

//Services
import { LeaguesService } from './services/leagues.service';

//Components
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';
import { MainPageComponent } from './components/body/game/live-game/main-page/livegame-main-page';
import { BoxscoreComponent } from './components/body/game/live-game/boxscore/boxscore.component';
import { PlayByPlayComponent } from './components/body/game/live-game/play-by-play/play-by-play.component';
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';

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
    NewplayerFormComponent
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
    LeaguesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
