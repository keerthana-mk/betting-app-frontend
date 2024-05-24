import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BettingGameServiceService, Game } from '../services/betting-game-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game-page',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})

export class LobbyComponent implements OnInit {

  gameDetail: Game[] = [];

  constructor(private bettingGameService: BettingGameServiceService, public dialog: MatDialog, private router: Router) {
  }

  public ngOnInit(): void {
    this.bettingGameService.fetchAllGames();

    this.bettingGameService.getGameDetails().subscribe(games => {
      this.gameDetail = games;
    });
  }

  public createNewGame(): void {
    let dialogRef = this.dialog.open(CreateGameModalComponent, {
      data: {
        height: '60%',
        width: '50%'
      }
    });
  }

  public joinGame(gameId: string): void {
    sessionStorage.setItem('currentGameId', gameId);
    this.router.navigate(['betting-game']);
  }
}
