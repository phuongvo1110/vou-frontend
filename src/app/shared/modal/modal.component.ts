import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"], // Fixed typo from styleUrl to styleUrls
})
export class ModalComponent implements OnChanges, OnInit {
  ngOnInit() {
    this.showModal = this.isOpen;
  }
  @Input() title: string = "";
  @Input() img!: string;
  @Input() isOpen: boolean = false; // Externally controlled open state
  @Input() size: "xl" | "lg" | "sm" | "md" = "xl";
  @Input() center: boolean = true;
  @Input() content: string = "";
  @Input() mainButton: string = "";
  @Input() sideButton: string = "";
  @Output() onCancel = new EventEmitter<void>(); // Added return type for consistency
  @Output() onConfirm = new EventEmitter<void>(); // Added return type for consistency

  showModal: boolean = false; // Internal modal state

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isOpen"]) {
      this.showModal = changes["isOpen"].currentValue;
    }
  }
  close() {
    this.showModal = false; // Close the modal
    this.onCancel.emit(); // Emit the cancel event
  }
  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.onCancel.emit(); // Emit cancel event only when closing
    }
  }

  confirm() {
    this.onConfirm.emit(); // Emit confirm event on confirmation action
    this.toggleModal(); // Close modal after confirming
  }
}
