import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { BettingGamePageComponent } from './betting-game-page/betting-game-page.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Login',
    component: LoginPageComponent
  },
  {
    path: 'login',
    title: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    title: 'register',
    component: UserRegistrationComponent,
  },
  {
    path: 'home',
    title: 'Homepage',
    component: LobbyComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    title: 'Homepage',
    component: AppComponent,
    children: [{
      path: 'betting-game',
      title: 'BettingGamePage',
      component: BettingGamePageComponent,
      canActivate: [authGuard]
    },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }