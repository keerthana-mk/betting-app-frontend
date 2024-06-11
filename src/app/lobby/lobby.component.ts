import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BettingGameServiceService, Game } from '../services/betting-game-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game-page',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})

export class LobbyComponent implements OnInit {

  gameDetail: Game[] = [];
  dialogRef: MatDialogRef<CreateGameModalComponent, any> | undefined;

  constructor(private bettingGameService: BettingGameServiceService, public dialog: MatDialog, private router: Router) {
  }

  public ngOnInit(): void {
    this.bettingGameService.reinitializeSocket();
    this.bettingGameService.fetchAllGames();

    this.bettingGameService.getGameDetails().subscribe(games => {
      this.gameDetail = games;
    });

    this.bettingGameService.createGameStatus.subscribe(status => {
      switch (status) {
        case 'success':
          alert('Successfully created room, join to the room from lobby!')
          this.dialogRef?.close();
          break;
        case 'failed':
          alert('Failed to create room, please try again.')
          break;
      }
    })
  }

  public createNewGame(): void {
    this.bettingGameService.updateCreateGameStatus('new');
    this.dialogRef = this.dialog.open(CreateGameModalComponent, {
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
