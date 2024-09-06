import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item } from "../_models/item";
import { environment } from "../environments/environment";
import { Item2 } from "../_models/item2";

@Injectable({ providedIn: 'root' })
export class ItemService {
    constructor(private httpClient: HttpClient) {

    }
    getItemsByPlayer(playerId: string) {
        return this.httpClient.get<{
            item: Item,
            numberOfItem: number
        }[]>(`${environment.apiUrl}/api/v1/statistics/api/statistics/player_item/player/${playerId}`);
    }
    getItemById(itemId: string) {
        return this.httpClient.get<Item>(`${environment.apiUrl}/api/v1/events/api/items/id/${itemId}`);
    }
    getItemsByEventID(eventId: string) {
        return this.httpClient.get<Item2[]>(`${environment.apiUrl}/api/v1/events/api/events/items/event/${eventId}`);
    }
}