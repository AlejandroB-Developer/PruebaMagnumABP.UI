import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerDataService {
  private player1: { id: number; name: string } = { id: 0, name: '' };
  private player2: { id: number; name: string } = { id: 0, name: '' };

  setPlayer1(id: number, name: string) {
    this.player1 = { id, name };
  }

  setPlayer2(id: number, name: string) {
    this.player2 = { id, name };
  }

  getPlayer1() {
    return this.player1;
  }

  getPlayer2() {
    return this.player2;
  }
}
