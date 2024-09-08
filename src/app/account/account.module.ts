import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgOtpInputComponent, NgOtpInputModule } from 'ng-otp-input';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule
  ],
})
export class AccountModule { }
