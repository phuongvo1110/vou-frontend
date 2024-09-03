import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root'})
export class NotificationService {
    constructor(private httpClient: HttpClient) {

    }
    registerToken(userId: string, token: string) {
        return this.httpClient.post(`${environment.apiUrl}/api/v1/notifications/api/notifications/register?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`, {});
    }
}