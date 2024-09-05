import { Component, OnInit, ViewChild } from "@angular/core";
import { GameItemComponent } from "../../shared/game-item/game-item.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EventsService } from "../../_services/events.service";
import { Event } from "../../_models/event";
import { Game } from "../../_models/game";
import { Item } from "../../_models/item";
import { Voucher } from "../../_models/voucher";
import { AccountService } from "../../_services/account.service";
import { TransactionService } from "../../_services/transaction.service";
import { ConversionParams } from "../../_models/conversion";
import { ToastComponent } from "../../shared/toast/toast.component";
import { ItemService } from "../../_services/item.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrl: "./event.component.css",
})
export class EventComponent implements OnInit {
  @ViewChild(ToastComponent) toast: ToastComponent;
  games: Game[] = [];
  vouchers: Voucher[] = [];
  openTab = 1;
  items: Item[] = [];
  modalItemOpen = false;
  disableButton: boolean = false;
  itemModalContent = "This is the gift from AAA event";
  modalTitle = "Items";
  voucherId: string = '';
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
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

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
    this.voucherId = voucherId;
    this.disableButton = false;
    this.modalItemOpen = true;
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
    // Fetch items associated with the voucher ID
    this.eventsService.getItemByVoucherId(voucherId).subscribe({
      next: (itemData) => {
        console.log(itemData);
        
        // Add the quantity attribute to each item based on the player's items
        this.items = itemData.map((item) => ({
          ...item,
          quantity: this.playerItems[item.id] || 0, // Default to 0 if no quantity found
        }));
  
        // Check the condition to disable the button after the items are set
        this.disableButton = this.items.every(item => item.quantity >= item.numberOfItem);
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.disableButton = true; // Optionally disable the button on error
      }
    });
  }
  

  onClose() {
    this.modalItemOpen = false;
  }

  onSubmit(voucherId: string) {
  console.log('Processing voucher exchange...');
  
  const items = this.items.map((item) => ({
    itemId: item.id,
    quantity: item.quantity,
  }));

  const params = [{
    playerId: this.userId,
    recipientId: this.userId,
    artifactId: voucherId,
    eventId: this.event.id,
    items: items,
    transactionDate: new Date().toISOString(),
    quantity: 1,
    transactionType: 'voucher_conversion'
  }];

  this.transactionService.transactionVoucherConversion(params).subscribe({
    next: (response) => {
      console.log('Transaction successful:', response);
      this.toast.openToast("Exchanging Voucher Successfully", "fa-check");
      // Update the item's quantity after the transaction is successful
      this.items.forEach(item => {
        if (this.playerItems[item.id] !== undefined) {
          this.playerItems[item.id] -= item.quantity;
        }
      });

      // Close the modal
      this.modalItemOpen = false;
    },
    error: (error) => {
      console.error('Transaction failed:', error);
      // Handle the error, e.g., display a message to the user
    }
  });
}

}
