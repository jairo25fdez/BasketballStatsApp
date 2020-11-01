import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Clubs components
import { ClubsMenuComponent } from './components/body/clubs/clubs-menu/clubs-menu.component';
import { ClubsListComponent } from './components/body/clubs/clubs-list/clubs-list.component';
import { NewclubFormComponent } from './components/body/clubs/newclub-form/newclub-form.component';

//Games components
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';
import { NewgameFormComponent } from './components/body/game/newgame-form/newgame-form.component';
import { GamesViewComponent } from './components/body/game/games-view/games-view.component';
import { MainPageComponent } from './components/body/game/live-game/main-page/livegame-main-page';
import { BoxscoreComponent } from './components/body/game/live-game/boxscore/boxscore.component';
import { PlayByPlayComponent } from './components/body/game/live-game/play-by-play/play-by-play.component';

//Players components
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';
import { PlayersMenuComponent } from './components/body/players/players-menu/players-menu.component';
import { PlayersViewComponent } from './components/body/players/players-view/players-view.component';
import { UpdateplayerFormComponent } from './components/body/players/updateplayer-form/updateplayer-form.component';
import { PlayerProfileComponent } from './components/body/players/player-profile/player-profile.component';

//Leagues components
import { NewleagueFormComponent } from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesViewComponent } from './components/body/leagues/leagues-view/leagues-view.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';

//Teams components
import { TeamsMenuComponent } from './components/body/teams/teams-menu/teams-menu.component';
import { TeamsListComponent } from './components/body/teams/teams-list/teams-list.component';
import { NewteamFormComponent } from './components/body/teams/newteam-form/newteam-form.component';
import { UpdateteamFormComponent } from './components/body/teams/updateteam-form/updateteam-form.component';
import { TeamProfileComponent } from './components/body/teams/team-profile/team-profile.component';

//Stats components
import { StatsMenuComponent } from './components/body/stats/stats-menu/stats-menu.component';
import { TeamsStatsComponent } from './components/body/stats/teams-stats/teams-stats.component';
import { PlayersStatsComponent } from './components/body/stats/players-stats/players-stats.component';

//Login component
import { LoginComponent } from './components/body/login/login.component';

//Main component
import { MainComponent } from './components/body/main/main.component';

const routes: Routes = [
  //Clubs routes
  {path: 'clubs', component: ClubsMenuComponent,
    children: [
      {path: 'clubs-list', component: ClubsListComponent},
      {path: 'new-club', component: NewclubFormComponent},
      {path: 'edit-club/:id', component: NewclubFormComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'clubs-list'}
    ]
  },
  //Login routes
    {path: 'login', component: LoginComponent},
  //Main component
    {path: 'home', component: MainComponent},
  //Game routes
    {path: 'live-game/:id', component: LiveGameComponent,
    children: [
      {path: 'main-page', component: MainPageComponent},
      {path: 'boxscore', component: BoxscoreComponent},
      {path: 'play-by-play', component: PlayByPlayComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'main-page'}
    ]
    },
    {path: 'game-menu', component: GameMenuComponent,
    children: [
      {path: 'new-game', component: NewgameFormComponent},
      {path: 'games-list', component: GamesViewComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'games-list'}
    ]
    },
  //Player routes
    {path: 'players', component: PlayersMenuComponent,
    children: [
        {path: 'new-player', component: NewplayerFormComponent},
        {path: 'players-list', component: PlayersViewComponent},
        {path: 'edit-player/:id', component: UpdateplayerFormComponent},
        {path: 'player-profile/:id', component: PlayerProfileComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'players-list'}
      ]
    },
    //Teams routes
    {path: 'teams', component: TeamsMenuComponent,
    children: [
        {path: 'new-team', component: NewteamFormComponent},
        {path: 'teams-list', component: TeamsListComponent},
        {path: 'edit-team/:id', component: UpdateteamFormComponent},
        {path: 'team-profile/:id', component: TeamProfileComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'teams-list'}
      ]
    },
  //Leagues routes
    {path: 'leagues', component: LeaguesMenuComponent,
      children: [
        {path: 'new-league', component: NewleagueFormComponent},
        {path: 'leagues-list', component: LeaguesViewComponent},
        {path: 'edit-league/:id', component: NewleagueFormComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'leagues-list'}
      ]
    },
  //Stats routes
  {path: 'stats', component: StatsMenuComponent,
    children: [
      {path: 'teams-stats', component: TeamsStatsComponent},
      {path: 'players-stats', component: PlayersStatsComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'teams-stats'}
    ]
  },
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: 'login'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
