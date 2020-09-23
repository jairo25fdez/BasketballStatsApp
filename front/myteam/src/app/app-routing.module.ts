import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';


const routes: Routes = [
  //Game routes
    {path: 'live-game', component: LiveGameComponent},
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
