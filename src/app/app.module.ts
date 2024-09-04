import { DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { AccountModule } from "./account/account.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EventsModule } from "./events/events.module";
import { CategoryComponent } from "./pages/category/category.component";
import { GameComponent } from "./pages/game/game.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ShakingGameComponent } from "./pages/shaking-game/shaking-game.component";
import { SharedModule } from "./shared/shared.module";
import { VoucherComponent } from "./pages/voucher/voucher.component";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ShakingGameComponent,
    ProfileComponent,
    CategoryComponent,
    VoucherComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    RouterOutlet,
    SharedModule,
    EventsModule,
    AccountModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
})
export class AppModule { }
