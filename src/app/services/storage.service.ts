import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItem(key: string) {
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  itemExists(key: string) {
    return sessionStorage.getItem(key)? true : false;
  }
}
