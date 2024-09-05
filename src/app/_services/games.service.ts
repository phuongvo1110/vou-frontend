import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Game } from "../_models/game";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class GamesService {
    constructor(private http: HttpClient) {
    }
    getGameById(gameId: string) {
        return this.http.get<Game>(`${environment.apiUrl}/api/v1/games/games/${gameId}`);
    }
}