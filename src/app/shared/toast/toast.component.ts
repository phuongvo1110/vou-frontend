import { ChangeDetectorRef, Component } from "@angular/core";

interface ToastNotification {
  message: string;
  icon: string;
  id: number;  // Unique ID for each toast
}

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.css"],
})
export class ToastComponent {
  notifications: ToastNotification[] = [];
  constructor(private cdr: ChangeDetectorRef) {}
  openToast(message: string, icon: string) {
    const id = new Date().getTime(); // Generate a unique ID for each toast
    const newToast: ToastNotification = { message, icon, id };
    this.notifications.push(newToast);

    // Remove the toast after 5 seconds
    setTimeout(() => {
      console.log("Closing toast after 5 seconds:", id);
      this.closeToast(id);
      this.cdr.detectChanges();
    }, 5000);
  }

  closeToast(id: number) {
    this.notifications = this.notifications.filter(toast => toast.id !== id);
  }
}
