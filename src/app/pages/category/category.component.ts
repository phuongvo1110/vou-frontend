import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShakeDetectService } from "../../shake-detect.service";
import { ItemService } from "../../_services/item.service";
import { AccountService } from "../../_services/account.service";
import { Item } from "../../_models/item";
import { Brand } from "../../_models/brand";
import { ImageService } from "../../image.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  modalOpenForm = false;
  secondModalOpenForm = false; // New state for second modal
  modalTitleForm = "";
  disable: boolean = true;
  items: {
    item: Item;
    numberOfItem: number;
  }[] = [];
  itemSelf: any;
  userId: string = "";
  secondModalTitleForm = "Send gift to your friend"; // Title for second modal
  firstModalContent = "This is the gift from AAA event";
  playerItems: { [key: string]: number } = {};
  imgUrl: string = '';
  constructor(
    private itemService: ItemService,
    private accountService: AccountService,
    private imageService: ImageService
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
      next: (itemData) => {
        console.log("Item", itemData);
        this.itemSelf = itemData;
        this.modalTitleForm = itemData.name;
        this.imageService.getImageUrl(itemData.icon).subscribe({
          next: (data) => this.imgUrl = data
        })
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

  onSecondModalSubmit() {
    this.secondModalOpenForm = false;
    // Additional logic for the second modal's confirm action can be added here
  }
}
