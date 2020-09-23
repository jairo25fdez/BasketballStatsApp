import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Routes
//import { AppRoutingModule } from './app-routing.module';
import { APP_ROUTING } from './app-routing.module';

//Components
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    LiveGameComponent,
    GameMenuComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    APP_ROUTING
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
