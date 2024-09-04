import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Item } from "../_models/item";

@Injectable({ providedIn: 'root'})
export class ItemService {
    constructor(private httpClient: HttpClient) {

    }
    getItemsByPlayer(playerId: string ) {
        return this.httpClient.get<{
            item: Item,
            numberOfItem: number
        }[]>(`${environment.apiUrl}/api/v1/statistics/api/statistics/player_item/player/${playerId}`);
    }
}