import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../shared/list/list.component';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { EventsService } from '../_services/events.service';
import { Event } from '../_models/event';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  constructor(private eventsService: EventsService, private imageService: ImageService) {

  }
  ngOnInit(): void {
    const eventInProgress = this.eventsService.getAllEventsInProgress().subscribe({
      next: (eventData: any) => {
        this.events = eventData;
        console.log(this.events)
      },
      error: (error) => console.error('Error:', error)
    })
    // const imageUrl = this.imageService.getImageUrl('a1c7a5ec-11ef-40d1-b077-f6e9c3b22f59_highland_event.jpg').subscribe({
    //   next: (data: any) => console.log(data)
    // });
    this.imageService.getImageUrl('a1c7a5ec-11ef-40d1-b077-f6e9c3b22f59_highland_event.jpg').subscribe({
      next: (url: string) => {
        console.log(url);
      },
      error: (err) => {
        console.error('Failed to get image URL:', err);
      }
    });
  }

}
