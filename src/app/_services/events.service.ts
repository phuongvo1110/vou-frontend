import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Event } from "../_models/event";
import { Game } from "../_models/game";
import { Item } from "../_models/item";
import { Voucher } from "../_models/voucher";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class EventsService {
    constructor(private http: HttpClient) {

    }
    getEventById(eventId: string) {
        return this.http.get<Event>(`${environment.apiUrl}/api/v1/events/api/events/id/${eventId}`);
    }
    getAllEventsInProgress() {
        return this.http.get<Event[]>(`${environment.apiUrl}/api/v1/events/api/events/inProgress`);
    }
    getGameByEventID(brandId: string) {
        return this.http.get<Game[]>(`${environment.apiUrl}/api/v1/events/api/events/games/event/${brandId}`);
    }
    getVoucherByEventID(brandId: string) {
        return this.http.get<Voucher[]>(`${environment.apiUrl}/api/v1/events/api/events/vouchers/event/${brandId}`);
    }
    getItemByVoucherId(voucherId: string) {
        return this.http.get<Item[]>(`${environment.apiUrl}/api/v1/events/api/items/voucher/${voucherId}`);
    }
}