import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root'})
export class ItemService {
    constructor(private httpClient: HttpClient) {

    }
    getItemsByPlayer(playerId: string ) {
        return this.httpClient.get(`${environment.apiUrl}/api/v1/statistics/api/statistics/player_item/player/${playerId}`);
    }
}