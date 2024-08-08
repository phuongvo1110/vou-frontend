import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.css",
})
export class ToastComponent {
  @Input() message: string = "";
  @Input() type: 'success' | 'danger' | 'warning';
  @Input() icon: string = "";
  toastOpen: boolean = false;
  timer?: any;
  openToast(message: string, type: 'success' | 'danger' | 'warning', icon: string) {
    if (this.toastOpen) return;
    this.message = message;
    this.type = type;
    this.icon = icon;
    this.toastOpen = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.toastOpen = false;
    }, 5000);
  }
  closeToast() {
    this.toastOpen = false;
    clearTimeout(this.timer);
  }
}
