import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class SessionsService {
    apiUrl: string = "http://localhost:8084/sessions/api/sessions";
    private evenId: string = "380117a3-9487-427c-ba30-d5afc990f6c6";
    private gameId: string = "1";
    private date: string = "2024-09-03";

    constructor(private http: HttpClient) {
    }

    findActiveSession() {
        return this.http.get<string>(`${this.apiUrl}?eventId=${this.evenId}&gameId=${this.gameId}&date=${this.date}`).pipe(map((response: any) => {
            console.log("Response sessionID: ", response.sessionId);
            // this.sessionId = response.data[0].id;
            return response;
        }));
    }
}
