import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../shared/list/list.component';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { EventsService } from '../_services/events.service';
import { Event } from '../_models/event';
import { ImageService } from '../image.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  likedEventIds: string[] = [];
  userId: string = '';
  constructor(private eventsService: EventsService, private imageService: ImageService,
    private accountService: AccountService
  ) {

  }
  ngOnInit(): void {
    this.accountService.getMyInfo().subscribe({
      next: (userData: any) => {
        this.userId = userData.result.id;

        // Fetch all events in progress
        this.eventsService.getAllEventsInProgress().subscribe({
          next: (eventData: Event[]) => {
            this.events = eventData;

            // After fetching events, fetch liked events
            this.fetchLikedEvents();
          },
          error: (error) => console.error('Error:', error)
        });
      }
    });
  }
  fetchLikedEvents() {
    this.eventsService.getLikeEvents({
      userId: this.userId,
      likeableType: 'event'
    }).subscribe({
      next: (likedEventData: any) => {
        this.likedEventIds = likedEventData.map((event: any) => event.likeableId);

        // Update the liked state for each event
        this.updateLikedState();
      },
      error: (error) => console.error('Error fetching liked events:', error)
    });
  }
  updateLikedState() {
    this.events = this.events.map(event => ({
      ...event,
      liked: this.likedEventIds.includes(event.id)  // Check if the event is in the likedEventIds array
    }));
  }
}
