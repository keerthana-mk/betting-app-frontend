import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent {

  constructor(private authService: AuthService, private storageService: StorageService){}

  logout(){
    this.authService.userLogout();
  }
  
  getUserEmail() {
    return this.storageService.getItem('userEmail');
  }
}
