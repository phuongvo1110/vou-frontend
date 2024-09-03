import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AccountService } from "../_services/account.service";

@Injectable() 
export class JwtInterceptor implements HttpInterceptor{
    constructor(private accountService: AccountService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.result.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            console.log('Adding Authorization header:', `Bearer ${user.result.token}`);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.result.token}`
                }
            });
        } else {
            console.log('No Authorization header added.');
        }
        return next.handle(request); 
    }
    

}