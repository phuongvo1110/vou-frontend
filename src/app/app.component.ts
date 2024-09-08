import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "./_services/account.service";
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from "@capacitor/push-notifications";
import { NotificationService } from "./_services/notification.service";
import { LocalNotifications } from "@capacitor/local-notifications";
import { ToastComponent } from "./shared/toast/toast.component";
import { ToastService } from "./_services/toast.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  userId: string = "";
  toastOpen: boolean = false;
  message: string = "";
  icon: string = "fa-check";
  timer?: any;
  @ViewChild(ToastComponent) toastComponent: ToastComponent;
  // @ViewChild(ToastComponent) toast: ToastComponent;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.toastService.registerToastComponent(this.toastComponent);
  }

  ngOnInit() {
    // Check if user is logged in
    if (this.accountService.userValue) {
      this.accountService.getMyInfo().subscribe({
        next: (userData: any) => {
          this.userId = userData.result.id;
          console.log("Registering Push Notifications for userId", this.userId);

          // Request Push Notification permissions
          PushNotifications.requestPermissions().then((result) => {
            if (result.receive === "granted") {
              PushNotifications.register();
            } else {
              console.log("Permission denied");
            }
          });

          // Register push notification token
          PushNotifications.addListener("registration", (token: Token) => {
            console.log("UserID:", this.userId);
            if (this.userId) {
              this.notificationService
                .registerToken(this.userId, token.value)
                .subscribe({
                  next: () => console.log("Token registered successfully"),
                  error: (err) =>
                    console.error("Error registering token:", err),
                });
              console.log("Push registration success, token:", token.value);
            }
          });

          // Handle registration errors
          PushNotifications.addListener("registrationError", (error: any) => {
            console.error("Error during registration:", JSON.stringify(error));
          });

          // Handle receiving notifications
          PushNotifications.addListener(
            "pushNotificationReceived",
            (notification: PushNotificationSchema) => {
              console.log('Noti: ', notification)
              this.toastService.show(notification.title || "New Notification", "fa-check");
              this.cdr.detectChanges();
              // this.toastOpen = true;
              // const notificationTitle =
              //   notification.title || "New Notification";
              // this.message = notificationTitle;
              // this.timer = setTimeout(() => {
              //   this.toastOpen = false;
              // }, 5000);
              // this.toast.openToast(notificationTitle, "fa-check");
              // console.log("Toast opened:", this.toast);
              // await LocalNotifications.schedule({
              //   notifications: [
              //     {
              //       title: notification.title || "Notification",
              //       body: notification.body || "You have a new notification",
              //       id: new Date().getTime(),  // Unique notification id
              //       schedule: { at: new Date(Date.now() + 1000) },
              //     },
              //   ],
              // });
            }
          );

          // Handle notification actions
          PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (notification: ActionPerformed) => {
              console.log("Notification action performed:", notification);
              // Navigate based on notification payload
              this.router.navigate(["/target-page"]); // Adjust based on notification data
            }
          );
        },
      });

      this.router.navigate(["/events"]);
    } else {
      this.router.navigate(["/"]);
    }
  }
  closeToast() {
    this.toastOpen = false;
    clearTimeout(this.timer);
  }
}
