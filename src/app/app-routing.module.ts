import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { EventComponent } from './events/event/event.component';
import { EventsComponent } from './events/events.component';
import { CategoryComponent } from './pages/category/category.component';
import { GameComponent } from './pages/game/game.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShakingGameComponent } from './pages/shaking-game/shaking-game.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/event', component: EventComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'events/event/game', component: GameComponent },
    { path: 'events/event/shaking-game', component: ShakingGameComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'register', component: RegisterComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
