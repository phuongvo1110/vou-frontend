import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../shared/list/list.component';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { EventsService } from '../_services/events.service';
import { Event } from '../_models/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  constructor(private eventsService: EventsService) {

  }
  ngOnInit(): void {
    const eventInProgress = this.eventsService.getAllEventsInProgress().subscribe({
      next: (eventData: any) => {
        this.events = eventData;
        console.log(this.events)
      },
      error: (error) => console.error('Error:', error)
    })
  }

}
