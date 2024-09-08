import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Event } from "../../_models/event";
import { Voucher } from "../../_models/voucher";
import { EventsService } from "../../_services/events.service";
import { AccountService } from "../../_services/account.service";
import { ShareService } from "../../_services/share.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.css",
})
export class ListComponent {
  @Input() events?: Event[] = [];
  @Input() vouchers?: Voucher[] = [];
  @Input() userId?: string;
  constructor(private eventsService: EventsService,
    private accountService: AccountService,
    private shareService: ShareService

  ) {}
  handleLikeEvent(event: Event) {
    // Toggle like state locally
    if (!event.liked) {
      event.liked = !event.liked;

      // Send the like/unlike request to the server
      this.eventsService
        .handleLikeEvent({
          userId: this.userId as string, // Replace with the actual user ID
          likeableType: "event",
          likeableId: event.id,
        })
        .subscribe({
          next: () => {
            console.log(
              `${event.liked ? "Liked" : "Unliked"} event:`,
              event.id
            );
          },
          error: (error) => {
            console.error("Error liking/unliking event:", error);
            // Revert the like state in case of error
            event.liked = !event.liked;
          },
        });
    } else {
      event.liked = !event.liked;

      // Send the like/unlike request to the server
      this.eventsService
        .handleUnlikeEvent({
          userId: this.userId as string, // Replace with the actual user ID
          likeableType: "event",
          likeableId: event.id,
        })
        .subscribe({
          next: () => {
            console.log(
              `${event.liked ? "Liked" : "Unliked"} event:`,
              event.id
            );
          },
          error: (error) => {
            console.error("Error liking/unliking event:", error);
            // Revert the like state in case of error
            event.liked = !event.liked;
          },
        });
    }
  }
  updateEventStatus(eventStartTime?: string) {
    const currentTime = new Date(); // Get the current time
    const startTime = new Date(eventStartTime as string); // Convert the event start time to a Date object

    if (startTime > currentTime) {
      return "Upcoming";
    } else {
      return "In Progress";
    }
  }
  onShare(link?: string, message?: string) {
    if (link && message) {
      this.shareService.shareGameOnFacebook(link, message);
      setTimeout(() => {
        const userId = JSON.parse(localStorage.getItem("playerId") as string);

        this.accountService.updatePlayerTurns(userId).subscribe({
          next: (data) => {
            console.log("Update turns successfully");
          },
        });
      }, 5000);
    }
  }
}
