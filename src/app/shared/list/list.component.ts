import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../_models/event';
import { Voucher } from '../../_models/voucher';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  @Input() events?: Event[] = [];
  @Input() vouchers?: Voucher[] = [];
  updateEventStatus(eventStartTime?: string) {
    const currentTime = new Date(); // Get the current time
    const startTime = new Date(eventStartTime as string); // Convert the event start time to a Date object

    if (startTime > currentTime) {
      return 'Upcoming';
    } else {
      return 'In Progress';
    }
  }
}
