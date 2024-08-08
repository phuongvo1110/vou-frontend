import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  modalOpenForm = false;
  secondModalOpenForm = false; // New state for second modal
  modalTitleForm = "";
  secondModalTitleForm = "Send gift to your friend"; // Title for second modal
  firstModalContent = "This is the gift from AAA event";
  imgUrl = "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg";

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
