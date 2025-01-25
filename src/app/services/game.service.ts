import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateGame } from '../models/create-game';
import { CreateRound } from '../models/create-round';
import { Rounds } from '../models/rounds';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  apiUrl = `${environment.apiBaseUrl}`;

  constructor(private _http: HttpClient) {}

  createNewGame(game: CreateGame): Observable<any> {
    return this._http.post(`${this.apiUrl}/createNewGame`, game);
  }
}
