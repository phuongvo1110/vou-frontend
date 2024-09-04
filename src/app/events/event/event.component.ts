import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Event } from "../../_models/event";
import { Game } from "../../_models/game";
import { Item } from "../../_models/item";
import { Voucher } from "../../_models/voucher";
import { AccountService } from "../../_services/account.service";
import { EventsService } from "../../_services/events.service";
import { ItemService } from "../../_services/item.service";

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
  event: Event = {
    id: "",
  };
  userId: string = "";
  playerItems: { [key: string]: number } = {};
  targetQuantity: number = 2;

  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
  }

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private itemService: ItemService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get("id");
    if (eventId) {
      this.eventsService.getEventById(eventId).subscribe({
        next: (event) => (this.event = event),
      });
      this.eventsService.getGameByEventID(eventId).subscribe({
        next: (gameData) => {
          console.log(gameData);
          this.games = gameData;
        },
        error: (error) => console.error("Error:", error),
      });
      this.eventsService.getVoucherByEventID(eventId).subscribe({
        next: (voucherData) => {
          this.vouchers = voucherData;
          console.log(this.vouchers);
        },
        error: (error) => console.error("Error:", error),
      });
    }

    this.accountService.getMyInfo().subscribe({
      next: (userData: any) => {
        this.userId = userData.result.id;
        this.itemService.getItemsByPlayer(this.userId).subscribe({
          next: (
            itemsData: {
              item: Item;
              numberOfItem: number;
            }[]
          ) => {
            console.log("Items: ", itemsData);
            // Map the player's items by item id
            this.playerItems = itemsData.reduce(
              (acc, item) => ({ ...acc, [item.item.id]: item.numberOfItem }),
              {}
            );
          },
        });
      },
    });
  }

  openModal(voucherId: string) {
    this.modalItemOpen = true;
    this.eventsService.getItemByVoucherId(voucherId).subscribe({
      next: (itemData) => {
        console.log(itemData);
        // Add the quantity attribute to each item based on the player's items
        this.items = itemData.map((item) => ({
          ...item,
          quantity: this.playerItems[item.id] || 0, // Default to 0 if no quantity found
        }));
      },
    });
  }

  onClose() {
    this.modalItemOpen = false;
  }

  onSubmit() {
    this.modalItemOpen = false;
  }
}
