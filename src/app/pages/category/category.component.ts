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
  secondModalTitleForm = "Confirmation Required"; // Title for second modal
  firstModalContent = "This is the gift from AAA event";
  secondModalContent = "This is the content of the second modal.";
  imgUrl = "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg";

  openModal() {
    console.log('Opening First Modal');
    this.modalTitleForm = "Item A";
    this.modalOpenForm = true;
  }

  onClose() {
    console.log('Closing First Modal');
    this.modalOpenForm = false;
    this.secondModalOpenForm = false;
  }

  onSubmit() {
    console.log('First Modal Confirmed');
    this.modalOpenForm = false;
    this.openSecondModal();
  }

  openSecondModal() {
    console.log('Opening Second Modal');
    this.secondModalOpenForm = true;
  }

  onSecondModalSubmit() {
    console.log('Second Modal Confirmed');
    this.secondModalOpenForm = false;
    // Additional logic for the second modal's confirm action can be added here
  }
}
