import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Games components
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';

//Players components
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';

//Leagues components
import {NewleagueFormComponent} from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';

const routes: Routes = [
  //Game routes
    {path: 'live-game', component: LiveGameComponent},
    {path: 'game-menu', component: GameMenuComponent},
  //Player routes
    {path: 'new-player', component: NewplayerFormComponent},
  //Leagues routes
    {path: 'new-league', component: NewleagueFormComponent},
    {path: 'leagues-menu', component: LeaguesMenuComponent},
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
