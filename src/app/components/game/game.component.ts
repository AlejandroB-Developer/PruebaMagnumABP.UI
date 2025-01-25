import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Move } from '../../shared/constants/moves';
import { CreateGame } from '../../models/create-game';
import { CreateRound } from '../../models/create-round';
import { Rounds } from '../../models/rounds';
import { GameService } from '../../services/game.service';
import { PlayerDataService } from '../../services/player-data.service';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  move = Move;

  player1Id: number = 0;
  player1Name: string = '';
  player2Id: number = 0;
  player2Name: string = '';
  gameId: number = 0;
  game: CreateGame = {
    isGameFinished: false,
    gameId: 0,
    player1Id: 0,
    player2Id: 0,
    winnerId: 0,
  };
  round: CreateRound = {
    gameId: 0,
    player1MoveId: 0,
    player2MoveId: 0,
    result: '',
  };
  roundWinner: string = '';
  roundWinnerName: string = '';

  totalRounds: number = 0;
  player1Wins: number = 0;
  player2Wins: number = 0;

  player1Move: Move | null = null;
  player2Move: Move | null = null;

  player1Selected: boolean = false;
  player2Selected: boolean = false;

  displayDialog: boolean = false;
  winner: string | null = null;
  winnerId: number = 0;

  rounds: Rounds[] = [];

  constructor(
    private router: Router,
    private gameService: GameService,
    private roundService: RoundService,
    private playerDataService: PlayerDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const player1 = this.playerDataService.getPlayer1();
    const player2 = this.playerDataService.getPlayer2();

    if (player1) {
      this.player1Id = player1.id;
      this.player1Name = player1.name;
    }

    if (player2) {
      this.player2Id = player2.id;
      this.player2Name = player2.name;
    }

    this.crearPartida();
  }

  selectOption(player: number, option: Move) {
    if (player === 1 && !this.player1Selected) {
      this.player1Move = option;
      this.player1Selected = true;
    } else if (player === 2 && !this.player2Selected) {
      this.player2Move = option;
      this.player2Selected = true;
    }

    if (this.player1Move && this.player2Move) {
      this.evaluateRound();
    }
  }

  evaluateRound() {
    if (this.player1Move === this.player2Move) {
      this.roundWinner = 'Empate';
    } else if (
      // Jugador 1 gana
      (this.player1Move === Move.Piedra &&
        (this.player2Move === Move.Tijera ||
          this.player2Move === Move.Lagarto)) ||
      (this.player1Move === Move.Papel &&
        (this.player2Move === Move.Piedra ||
          this.player2Move === Move.Spock)) ||
      (this.player1Move === Move.Tijera &&
        (this.player2Move === Move.Papel ||
          this.player2Move === Move.Lagarto)) ||
      (this.player1Move === Move.Lagarto &&
        (this.player2Move === Move.Papel || this.player2Move === Move.Spock)) ||
      (this.player1Move === Move.Spock &&
        (this.player2Move === Move.Tijera || this.player2Move === Move.Piedra))
    ) {
      // Jugador 1 gana
      this.player1Wins++;
      this.roundWinner = this.player1Id.toString();
      this.roundWinnerName = this.player1Name;
    } else {
      // Jugador 2 gana
      this.player2Wins++;
      this.roundWinner = this.player2Id.toString();
      this.roundWinnerName = this.player2Name;
    }

    this.totalRounds++;

    this.round = {
      gameId: this.gameId,
      player1MoveId: this.player1Move!,
      player2MoveId: this.player2Move!,
      result: this.roundWinner,
    };

    this.roundService.createNewRound(this.round).subscribe(
      (response) => {
        if (this.roundWinner === 'Empate') {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Ronda ${this.totalRounds} : Empate`,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Ganador de la ronda ${this.totalRounds} : ${this.roundWinnerName}`,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    );

    this.resetChoicesAfterDelay();

    if (this.player1Wins === 3 || this.player2Wins === 3) {
      this.showWinner();
    }
  }

  showWinner() {
    this.winner = this.player1Wins === 3 ? this.player1Name : this.player2Name;
    this.winnerId = this.player1Wins === 3 ? this.player1Id : this.player2Id;

    this.game = {
      isGameFinished: true,
      player1Id: this.player1Id,
      player2Id: this.player2Id,
      gameId: this.gameId,
      winnerId: this.winnerId,
    };

    this.gameService.createNewGame(this.game).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Partida Finalizada',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    );

    this.roundService.getRoundsHistory(this.gameId).subscribe(
      (response) => {
        this.rounds = response;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    );

    this.displayDialog = true;
  }

  resetChoicesAfterDelay() {
    setTimeout(() => {
      this.resetChoices();
    }, 2000);
  }

  resetChoices() {
    this.player1Move = null;
    this.player2Move = null;
    this.player1Selected = false;
    this.player2Selected = false;
  }

  restartGame() {
    this.player1Wins = 0;
    this.player2Wins = 0;
    this.totalRounds = 0;
    this.resetChoices();
    this.displayDialog = false;
    this.crearPartida();
  }

  exitGame() {
    this.router.navigate(['/']);
  }

  crearPartida() {
    this.game = {
      isGameFinished: false,
      player1Id: this.player1Id,
      player2Id: this.player2Id,
    };

    this.gameService.createNewGame(this.game).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inicia la Partida',
        });
        this.gameId = response;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    );
  }
}
