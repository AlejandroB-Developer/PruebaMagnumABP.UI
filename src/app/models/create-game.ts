export interface CreateGame {
  isGameFinished: boolean;
  gameId?: number;
  player1Id: number;
  player2Id: number;
  winnerId?: number;
}
