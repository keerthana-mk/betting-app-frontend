import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounce, debounceTime, Subject, takeUntil } from 'rxjs';
import { BettingGameServiceService, Game } from '../services/betting-game-service.service';
import { StorageService } from '../services/storage.service';

export interface PrevRoundBetDetail {
  betAmount: number;
  playerId: string;
}

@Component({
  selector: 'app-betting-game-page',
  templateUrl: './betting-game-page.component.html',
  styleUrls: ['./betting-game-page.component.scss']
})
export class BettingGamePageComponent implements OnInit {
  public timerInterval: any;
  private ngUnsubscribe = new Subject<void>();

  isTimedOut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  display: any;
  balance: number = 0;

  betChosen: number = 0;
  waitingMessage = "Waiting for your bet...";
  showMessage = true;
  gameName: string = '';

  betPlaced: boolean = false;
  round: number = 1;

  status: string = 'new';

  roundBets: PrevRoundBetDetail[] = [];

  currentGame: Game = BettingGameServiceService.DEFAULT_GAME;

  constructor(private bettingGameService: BettingGameServiceService, private storageService: StorageService, private router: Router) {

  }
  isNumber = (val: any) => typeof val === "number" && val === val;

  setBetChosen(event: any) {
    this.betChosen = isNaN(Number(event.target.value)) ? -1 : Number(event.target.value)
  }

  isPlaceBetClicked() {
    if (this.betChosen != 0 && this.betChosen < 1) {
      alert('Invalid bet amount. Enter a valid amount to place bet.')
    }
    else if (this.betChosen > this.balance) {
      alert('Insufficient balance. Please choose an appropriate bet!');
    } else {
      this.placeBet(this.betChosen);
    }
  }

  ngOnInit(): void {
    let userInGame = this.storageService.getItem('inGame') && this.storageService.getItem('inGame') == 'true';
    let currentGameId = this.storageService.getItem('currentGameId')
    if (!userInGame && currentGameId) {
      this.bettingGameService.joinGame();
    }
    this.loadCurrentGameDetails();
    this.handleGameUpdates();
  }


  placeBet(betChosen: number) {
    this.betPlaced = true;
    this.balance = this.balance - betChosen;
    this.betChosen = 0;
    this.bettingGameService.placeBet(betChosen);
  }

  handleGameUpdates() {
    this.bettingGameService.gameStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(gameStatus => {
      // console.log('handling game state update to ' + gameStatus.status);
      clearInterval(this.timerInterval);
      this.status = gameStatus.status;
      this.roundBets = [];
      // console.log('gameStatus.roundBets: ' + JSON.stringify(gameStatus.roundBets));
      // console.log('Object.keys(gameStatus.roundBets): ' + Object.keys(gameStatus.roundBets));
      for (var playerId of Object.keys(gameStatus.roundBets)) {
        
        // console.log('gameStatus.roundBets[playerId][currentbet]: ', playerId, gameStatus.roundBets[playerId]['currentbet']);
        this.roundBets.push({
          playerId: playerId,
          betAmount: gameStatus.roundBets[playerId]['currentbet']
        })
      }
      // console.log('roundBets: ' + JSON.stringify(this.roundBets));
      switch (gameStatus.status) {
        case 'start':
          this.timer(1);
          // setTimeout(() => {
          //   if (this.betPlaced == false) {
          //     this.placeBet(this.balance);
          //   }
          // }, 60000);
          break;
        case 'waiting':
          break;
        case 'winner':
        case 'lost':
          this.storageService.setItem('inGame', 'false');
          break;
        case 'continue-game':
          // alert('You are through to the next round! Click OK to continue!');
          this.betPlaced = false;
          this.round += 1;
          this.timer(1);
          // setTimeout(() => {
          //   if (this.betPlaced == false) {
          //     this.placeBet(this.balance);
          //   }
          // }, 60000);
          break;
        case 'skipping-round':
          this.betPlaced = false;
          this.round += 1;
          // clearInterval(this.timerInterval);
          break;
      }
    })
  }

  loadCurrentGameDetails() {
    this.bettingGameService.getCurrentGame().pipe(takeUntil(this.ngUnsubscribe)).subscribe(gameDetails => {
      this.currentGame = gameDetails;
      this.balance = gameDetails.balance;
      this.gameName = gameDetails.gamename;
    });
  }

  isInWaitingRoom() {
    return ['waiting'].includes(this.status);
  }

  shouldAllowBetting() {
    return ['start', 'continue-game'].includes(this.status);
  }

  unknownGameState() {
    return ['unknown'].includes(this.status);
  }

  isGameComplete() {
    return ['winner', 'lost'].includes(this.status);
  }

  isSkippingRound() {
    return ['skipping-round'].includes(this.status);
  }

  getBetMessage() {
    return this.betPlaced ? 'Waiting for other players to place bets.' : 'Place your bet!';
  }

  getGameCompletionMessage() {
    switch (this.status) {
      case 'winner':
        return 'Congratulations! You won the game!';
      case 'lost':
        return 'Sorry! You lost the game! Better luck next time!';
      default:
        return 'Game over!'
    }
  }

  goToLobby() {
    this.exitGame();
    this.router.navigate(['home']);
  }

  exitGame() {
    this.storageService.setItem('currentGameId', '');
    this.storageService.setItem('inGame', 'false');
    this.currentGame = BettingGameServiceService.DEFAULT_GAME;
  }

  timer(minute: number) {

    if (!this.shouldAllowBetting())
      return;

    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0 ) {
        //call function to place bet and if no value entered. Place all the 200 coins` 
        this.placeBet(this.balance);
        clearInterval(this.timerInterval);
      }
    }, 1000);

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

