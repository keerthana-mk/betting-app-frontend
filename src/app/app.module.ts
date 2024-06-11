import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BettingGamePageComponent } from './betting-game-page/betting-game-page.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LobbyComponent } from './lobby/lobby.component';
import { CreateGameModalComponent } from './create-game-modal/create-game-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    BettingGamePageComponent,
    NavigationHeaderComponent,
    LobbyComponent,
    CreateGameModalComponent,
    LoginPageComponent,
    UserRegistrationComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule
  ],
  exports:[
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
