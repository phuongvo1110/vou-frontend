import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ShakeDetectService } from "../../shake-detect.service";
import { ItemService } from "../../_services/item.service";
import { AccountService } from "../../_services/account.service";
import { Item } from "../../_models/item";
import { Brand } from "../../_models/brand";
import { ImageService } from "../../image.service";
import { TransactionService } from "../../_services/transaction.service";
import { ToastComponent } from "../../shared/toast/toast.component";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  @ViewChild(ToastComponent) toast: ToastComponent;
  modalOpenForm = false;
  secondModalOpenForm = false; // New state for second modal
  modalTitleForm = "";
  disable: boolean = true;
  disableSend: boolean = false;
  items: {
    item: Item;
    numberOfItem: number;
  }[] = [];
  itemSelf: any;
  userId: string = "";
  secondModalTitleForm = "Send gift to your friend"; // Title for second modal
  firstModalContent = "This is the gift from AAA event";
  playerItems: { [key: string]: number } = {};
  imgUrl: string = "";
  receiverEmail: string = "";
  constructor(
    private itemService: ItemService,
    private accountService: AccountService,
    private imageService: ImageService,
    private transactionService: TransactionService
  ) {}
  ngOnInit(): void {
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
            this.items = itemsData;
          },
        });
      },
    });
  }
  openModal(itemId: string) {
    this.itemService.getItemById(itemId).subscribe({
      next: (itemData: Item) => {
        console.log("Item", itemData);
        this.itemSelf = itemData;
        this.modalTitleForm = itemData.name;
        this.imageService.getImageUrl(itemData.icon).subscribe({
          next: (data) => (this.imgUrl = data),
        });
      },
    });
    this.modalOpenForm = true;
  }

  onClose() {
    this.modalOpenForm = false;
    // this.secondModalOpenForm = false;
  }
  onCloseSecondModal() {
    this.secondModalOpenForm = false;
  }
  onSubmit() {
    this.modalOpenForm = false;
    this.openSecondModal();
  }

  openSecondModal() {
    this.secondModalOpenForm = true;
  }
  onReceiverIdChange(value: string): void {
    this.disableSend = value.trim() !== ""; // Disable send button if receiverId is empty
  }
  onSecondModalSubmit() {
    if (this.receiverEmail !== "") {
      this.disableSend = true;
      this.accountService.getUserByEmail(this.receiverEmail).subscribe({
        next: (userData) => {
          const receiverId = userData.id as string;
          this.transactionService.transactionItemShared([
            {
              playerId: this.userId,
              recipientId: receiverId,
              artifactId: this.itemSelf.id,
              eventId: "1",
              transactionDate: new Date().toISOString(),
              transactionType: "item_shared",
              quantity: 1,
            },
          ]).subscribe({
            next: (data) => {
              console.log(data);
              this.secondModalOpenForm = false;
              this.toast.openToast("Shared Item Successfully", "fa-check");
            }
          });
        }
      })
    }
    // Additional logic for the second modal's confirm action can be added here
  }
}
