import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './events/event/event.component';
import { NgModule } from '@angular/core';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GameComponent } from './pages/game/game.component';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
    {path: '', component: EventsComponent},
    {path: 'events/event', component: EventComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'events/event/game', component: GameComponent},
    {path: 'category', component: CategoryComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}
