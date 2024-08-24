import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../_services/account.service";

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private accountService: AccountService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const user = this.accountService.userValue;
        if (user) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

}