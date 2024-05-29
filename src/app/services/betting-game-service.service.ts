import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';


export interface GameDetailsResponse {
  uuid: string;
  games_list: Game[];
}

export interface PlaceBetRequest {
  uuid: string | null;
  game_uuid: string | null;
  bet: number;
}

export interface Game {
  totalPlayers: number,
  currentPlayers: number,
  gamename: string,
  game_uuid: string,
  balance: number,
}

export interface GameStatus {
  status: string,
  reward: number,
  balance: number
}

@Injectable({
  providedIn: 'root'
})
export class BettingGameServiceService {

  public static DEFAULT_GAME: Game = {
    totalPlayers: 10,
    currentPlayers: 1,
    gamename: '',
    game_uuid: '',
    balance: 0
  }

  DEFAULT_GAME_STATUS: GameStatus = {
    status: 'unknown',
    reward: -1,
    balance: -1,
  }

  gameDetails: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  currentGame: BehaviorSubject<Game> = new BehaviorSubject<Game>(BettingGameServiceService.DEFAULT_GAME);
  gameStatus: BehaviorSubject<GameStatus> = new BehaviorSubject<GameStatus>(this.DEFAULT_GAME_STATUS);

  countdown$: Observable<number> | undefined;
  private webSocket: Socket;

  constructor(private storageService: StorageService ) {
    this.webSocket = new Socket({
      url: "https://tgame.busillis.com/",
      options: {
        reconnection: true
      },
    });
    this.handleLobby();
    this.handleListGames();
    this.handleStartGame();
    this.handleGameWin();
    this.handleGameContinue();
    this.handleGameLost();
    this.handleGameSkip();
  }
  private readonly secondsSub = new Subject<number>();
  readonly seconds$ = this.secondsSub.asObservable();

  updateSeconds(seconds: number) {
    this.secondsSub.next(seconds);
  }

  connectSocket(message: string) {
    this.webSocket.emit('start_connection', message);
  }

  receiveStatus() {
    return this.webSocket.fromEvent('/');
  }

  disconnectSocket() {
    this.webSocket.disconnect();
  }

  fetchAllGames() {
    this.webSocket.emit("listGames", { 'uuid': this.storageService.getItem('userId') });
  }

  handleListGames() {
    this.webSocket.on("get_games_list", (data: any) => {
      var games = [];
      for (let i = 0; i < data.games_list.length; i++) {
        var curGameDetail = data.games_list[i];
        games.push(curGameDetail[Object.keys(curGameDetail)[0]]);
      }
      this.gameDetails.next(games);
    });
  }

  handleStartGame() {
    this.webSocket.on("start-game", (data: any) => {
      console.log('handling start game');
      let currentGameDetails: Game = {
        totalPlayers: data['totalPlayers'],
        currentPlayers: data['numPlayers'],
        gamename: data['gamename'],
        game_uuid: data['game_uuid'],
        balance: data['balance'],
      };
      this.currentGame.next(currentGameDetails);
      this.gameStatus.next({
        status: 'start',
        reward: -1,
        balance: data['balance']
      })
    });
  }

  handleGameWin() {
    this.webSocket.on('winner', (data: any) => {
      console.log('got winner response! ', JSON.stringify(data));
      this.gameStatus.next({
        status: 'winner',
        reward: data['reward'],
        balance: data['balance']
      });
    });
  }

  handleGameLost() {
    this.webSocket.on('lost', (data: any) => {
      console.log('got loser response! ', JSON.stringify(data));
      this.gameStatus.next({
        status: 'lost',
        reward: -1,
        balance: -1
      });
    });
  }

  handleGameContinue() {
    this.webSocket.on('continue-game', (data: any) => {
      console.log('got continue-game response! ', JSON.stringify(data));
      this.gameStatus.next({
        status: 'continue-game',
        reward: data['reward'],
        balance: data['balance']
      });
    });
  }

  handleGameSkip() {
    this.webSocket.on('skipping-round', (data: any) => {
      console.log('got skipping-round response! ', JSON.stringify(data));
      this.gameStatus.next({
        status: 'skipping-round',
        reward: data['reward'],
        balance: data['balance']
      });
    });
  }

  placeBet(bet: number) {
    let gameId = this.storageService.getItem('currentGameId');
    let userId = this.storageService.getItem('userId');
    console.log('betting for user ' + userId + ' in game ' + gameId);
    let placeBetRequest: PlaceBetRequest = {
      uuid: userId,
      game_uuid: gameId,
      bet: bet
    }
    this.webSocket.emit('place_bets', placeBetRequest);
  }

  createGame(gameName: string, numPlayers: number, startingAmount: number) {
    const gameData = {
      'uuid': this.storageService.getItem('userId'),
      'numPlayers': numPlayers,
      'balance': startingAmount,
      'gamename': gameName
    }
    this.webSocket.emit('createGame', gameData);
  }

  handleLobby() {
    this.webSocket.on('lobby', (data: any) => {
      let currentGameDetails: Game = {
        totalPlayers: data['totalPlayers'],
        currentPlayers: data['numPlayers'],
        gamename: data['gamename'],
        game_uuid: data['game_uuid'],
        balance: data['balance'],
      };
      this.currentGame.next(currentGameDetails);
      this.gameStatus.next({
        status: 'waiting',
        reward: -1,
        balance: data['balance']
      });
      this.storageService.setItem('currentGameId', data['game_uuid']);
      this.storageService.setItem('inGame', 'true');
    });
  }

  getGameDetails() {
    return this.gameDetails.asObservable();
  }

  getCurrentGame() {
    return this.currentGame.asObservable();
  }

  joinGame() {
    this.webSocket.emit('selectGame', {
      'game_uuid': this.storageService.getItem('currentGameId'),
      'uuid': this.storageService.getItem('userId')
    });
    this.storageService.setItem('inGame', 'true');
  }
}
