import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Games components
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';



const routes: Routes = [
  //Game routes
    {path: 'live-game', component: LiveGameComponent},
    {path: 'game-menu', component: GameMenuComponent},
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
