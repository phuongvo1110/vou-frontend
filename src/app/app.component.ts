import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private router: Router,
    private accountService: AccountService
) {
    // redirect to home if already logged in
    if (this.accountService.userValue) {
        this.router.navigate(['/']);
    }
}
}
