import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class SessionsService {
    apiUrl: string = "http://localhost:8084/sessions/api/sessions";


    constructor(private http: HttpClient) {
    }

    findActiveSession(eventId: string, gameId: string, date: string) {
        return this.http.get<string>(`${this.apiUrl}?eventId=${eventId}&gameId=${gameId}&date=${date}`).pipe(map((response: any) => {
            console.log("Response sessionID: ", response.sessionId);
            // this.sessionId = response.data[0].id;
            return response;
        }));
    }
}
