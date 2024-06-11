import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOGIN_URL, REGISTER_USER_URL } from '../api';
import { StorageService } from './storage.service';

interface LoginResponse{
  redirectRoute: string;
  status: number;
  uuid: string;
}

interface LoginRequest{
  emailAddress: string;
  password: string;
}

interface UserRegisterRequest{
  emailAddress: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  contact: string;
}

interface UserRegisterResponse{
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(private httpClient: HttpClient, private router: Router, private storageService: StorageService) { }

  registerUser(requestBody: UserRegisterRequest){
    return this.httpClient.post<UserRegisterResponse>(REGISTER_USER_URL, requestBody)
  }
  userLogin(requestBody: LoginRequest){
    return this.httpClient.post<LoginResponse>(LOGIN_URL, requestBody);
  }

  isUserAuthenticated() {
    return this.storageService.getItem('userId') ? true : false;
  }

  resetLocalStorage(){
    this.storageService.setItem('userId', '');
    this.storageService.setItem('inGame', '');
    this.storageService.setItem('currentGameId', '');
  }
  
  userLogout(){
    const inGameStatus = this.storageService.getItem('inGame');
    if(inGameStatus !== ''){
      alert('You will lose by exiting the game! Do you want to continue?');
      this.router.navigate(['login']);
      this.resetLocalStorage();
    }else{
      this.router.navigate(['login']);
      this.resetLocalStorage();
    }
  }
}
