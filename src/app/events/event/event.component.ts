import { Component, OnInit } from "@angular/core";
import { GameItemComponent } from "../../shared/game-item/game-item.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EventsService } from "../../_services/events.service";
import { Game } from "../../_models/game";
import { Voucher } from "../../_models/voucher";
import { Item } from "../../_models/item";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrl: "./event.component.css",
})
export class EventComponent implements OnInit {
  games: Game[] = [];
  vouchers: Voucher[] = [];
  openTab = 1;
  items: Item[] = [];
  modalItemOpen = false;
  itemModalContent = "This is the gift from AAA event";
  modalTitle = "Items";
  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
  }
  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) {}
  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get("id");
    if (eventId) {
      const gameList = this.eventsService.getGameByBrandID(eventId).subscribe({
        next: (gameData) => {
          console.log(gameData);
          this.games = gameData;
        },
        error: (error) => console.error("Error:", error),
      });
      const voucherList = this.eventsService
        .getVoucherByBrandID(eventId)
        .subscribe({
          next: (voucherData) => {
            this.vouchers = voucherData;
            console.log(this.vouchers);
          },
          error: (error) => console.error("Error:", error),
        });
    }
  }
  openModal(voucherId: string) {
    this.modalItemOpen = true;
    const itemList = this.eventsService
      .getItemByVoucherId(voucherId)
      .subscribe({
        next: (itemData) => {
          console.log(itemData);
          this.items = itemData;
        }
      });
  }
  onClose() {
    this.modalItemOpen = false;
  }
  onSubmit() {
    this.modalItemOpen = false;
  }
}
