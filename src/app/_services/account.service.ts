import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../_models/user";
import { environment } from "../environments/environment";
import { CapacitorHttp, CapacitorHttpPlugin, HttpOptions } from "@capacitor/core/types/core-plugins";

@Injectable({ providedIn: "root" })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    constructor(private router: Router, private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User | null>(
            JSON.parse(localStorage.getItem("user")!)
        );
        this.user = this.userSubject.asObservable();
    }
    public get userValue() {
        return this.userSubject.value;
    }
    login(username: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/api/v1/identity/auth/token`, {username, password}).pipe(map(user => {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
        }))
        // const response: HttpResponse<> = await CapacitorHttp.get({url: `${environment.apiUrl}/api/v1/identity/auth/token`})
        // const options: HttpOptions = {
        //     url: `${environment.apiUrl}/api/v1/identity/auth/token`,
        //     params: { username, password },
        // };

        // try {
        //     const response = await CapacitorHttp.get(options);

        //     // Assuming your API returns the user data in response.data
        //     const user: User = response.data;

        //     // Store user and update BehaviorSubject
        //     localStorage.setItem('user', JSON.stringify(user));
        //     this.userSubject.next(user);

        //     return user;
        // } catch (error) {
        //     console.error('Login failed', error);
        //     throw error;
        // }
    }
    logout() {
        localStorage.removeItem("user");
        this.userSubject.next(null);
        this.router.navigate(["/login"]);
    }
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/api/v1/identity/users/registration`, user);
    }
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/v1/identity/users`);
    }
    getMyInfo() {
        return this.http.get(`${environment.apiUrl}/api/v1/identity/users/my-info`);
    }
    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/api/v1/identity/users/${id}`);
    }
    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/api/v1/users/all-users/${id}`, params).pipe(map(x => {
            if (id == this.userValue?.id) {
                const user = { ...this.userValue, ...params};
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            }
            return x;
        }))
    }
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/v1/users/all-users/${id}`).pipe(map(x => {
            if (id == this.userValue?.id) {
                this.logout();
            }
            return x;
        }))
    }
}
