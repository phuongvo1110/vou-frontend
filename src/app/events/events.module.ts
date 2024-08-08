import { NgModule } from "@angular/core";
import { EventsComponent } from "./events.component";
import { EventComponent } from "./event/event.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterLink } from "@angular/router";

@NgModule({
    declarations: [EventsComponent, EventComponent],
    exports: [EventsComponent],
    imports: [CommonModule, FormsModule, SharedModule, RouterLink]
})
export class EventsModule {
    
}