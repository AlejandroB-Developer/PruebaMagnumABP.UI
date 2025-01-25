import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PlayerService } from '../../services/player.service';
import { PlayerDataService } from '../../services/player-data.service';
import { GameGuard } from '../../shared/guards/game.guard';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [MessageService],
})
export class PlayerComponent {
  player1Name = '';
  player2Name = '';
  player1Id = 0;
  player2Id = 0;
  isPlayer1Ready = false;
  isPlayer2Ready = false;
  visible: boolean = false;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private playerDataService: PlayerDataService,
    private messageService: MessageService,
    private gameGuard: GameGuard
  ) {}

  registerPlayer(playerNumber: number) {
    if (playerNumber === 1 && this.player1Name.trim()) {
      this.playerService.CreateNewPlayer(this.player1Name).subscribe(
        (response) => {
          this.isPlayer1Ready = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Jugador 1 registrado exitosamente',
          });
          this.player1Id = response;
          this.playerDataService.setPlayer1(this.player1Id, this.player1Name);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }
      );
    } else if (playerNumber === 2 && this.player2Name.trim()) {
      this.playerService.CreateNewPlayer(this.player2Name).subscribe(
        (response) => {
          this.isPlayer2Ready = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Jugador 2 registrado exitosamente',
          });
          this.player2Id = response;
          this.playerDataService.setPlayer2(this.player2Id, this.player2Name);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Error',
        detail: 'El campo no puede estar vacio',
      });
    }
  }

  showDialog() {
    this.visible = true;
  }

  continue(): void {
    this.gameGuard.grantAccess();
    this.router.navigate(['/new-game']);
  }
}
