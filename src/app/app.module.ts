import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AppRoutingModule } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
import { GameComponent } from "./pages/game/game.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { EventsModule } from "./events/events.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CategoryComponent } from "./pages/category/category.component";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ProfileComponent,
    CategoryComponent
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
    EventsModule
  ],
})
export class AppModule {}
