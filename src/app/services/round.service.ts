import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateRound } from '../models/create-round';
import { Rounds } from '../models/rounds';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  apiUrl = `${environment.apiBaseUrl}`;

  constructor(private _http: HttpClient) {}

  createNewRound(round: CreateRound): Observable<any> {
    return this._http.post(`${this.apiUrl}/createNewRound`, round);
  }

  getRoundsHistory(gameId: number): Observable<Rounds[]> {
    return this._http.get<Rounds[]>(
      `${this.apiUrl}/getRoundHistory?gameId=${gameId}`
    );
  }
}
