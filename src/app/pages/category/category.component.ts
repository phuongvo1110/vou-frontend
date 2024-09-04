import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShakeDetectService } from "../../shake-detect.service";
import { ItemService } from "../../_services/item.service";
import { AccountService } from "../../_services/account.service";
import { Item } from "../../_models/item";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  modalOpenForm = false;
  secondModalOpenForm = false; // New state for second modal
  modalTitleForm = "";
  items: {
    item: Item;
    numberOfItem: number;
  }[] = [];
  userId: string = "";
  secondModalTitleForm = "Send gift to your friend"; // Title for second modal
  firstModalContent = "This is the gift from AAA event";
  playerItems: { [key: string]: number } = {};
  imgUrl = "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg";
  constructor(
    private itemService: ItemService,
    private accountService: AccountService
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
  openModal() {
    this.modalTitleForm = "Item A";
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
