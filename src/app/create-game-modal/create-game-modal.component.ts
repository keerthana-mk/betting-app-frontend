import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BettingGameServiceService } from '../services/betting-game-service.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent implements OnInit{
  roomName: string = '';
  numPlayers: number = 10;
  startingAmount: number = 200;
  errorMessage: string = '';
  canCreate: boolean = false;
  createGameForm: FormGroup = new FormGroup({
    gameName: new FormControl(''),
    numOfPlayers: new FormControl(''),
    startingAmount: new FormControl(''),
  });
  constructor(private bettingGameService: BettingGameServiceService, private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.createGameForm = this.formBuilder.group({
      gameName: ['', Validators.required],
      numOfPlayers: ['', Validators.required],
      startingAmount: ['', Validators.required]
    });
    
  }

  createGame1(){
    console.log('======', this.createGameForm.value);
    this.roomName = this.createGameForm.value['gameName'];
    this.numPlayers = this.createGameForm.value['numOfPlayers'];
    this.startingAmount = this.createGameForm.value['startingAmount'];
    this.createGame(this.roomName, this.numPlayers, this.startingAmount);    
  }
  setRoomName(event: any) {
    this.roomName = event.target.value;
  }

  setNumPlayers(event: any) {
    this.numPlayers = event.target.value;
  }

  setStartingAmount(event: any) {
    this.startingAmount = event.target.value;
  }

  createGame(roomName: string, numPlayers: number, startingAmount:number) {
    console.log('#########', this.roomName, this.numPlayers, this.startingAmount);
    this.canCreate = true;
    if (this.numPlayers < 6 || this.numPlayers % 2 != 0) {
      this.errorMessage = 'Players in a room should be atleast 6 and of even number.';
      this.canCreate = false;
    } else if (this.startingAmount < 200) {
      this.errorMessage ='Starting amount should be greater than or equal to 200.';
      this.canCreate = false;
    } else if(!this.roomName) {
      this.errorMessage ='Room name cannot be empty.';
      this.canCreate = false;
    }
    if (this.canCreate) {
      this.bettingGameService.createGame(roomName, numPlayers, startingAmount);
      window.location.reload();
    }
    else
      alert(this.errorMessage);
  }
}
