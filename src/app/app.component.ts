import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  userId: string = "";
  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) {
    // redirect to home if already logged in
    if (this.accountService.userValue) {
      this.accountService.getMyInfo().subscribe({
        next: (userData: any) => {
          this.userId = userData.result.id;
          console.log('Registering Push Noti', this.userId);
          PushNotifications.requestPermissions().then((result) => {
            if (result.receive === "granted") {
              PushNotifications.register();
            } else {
              console.log("Permission denied");
            }
          });
          PushNotifications.addListener("registration", (token: Token) => {
            console.log('UserID: ', this.userId)
            if (this.userId) {
              this.notificationService
                .registerToken(this.userId, token.value)
                .subscribe({
                  next: (data) => console.log("Added token"),
                });
              console.log("Push registration success, token: " + token.value);
            }
          });

          PushNotifications.addListener("registrationError", (error: any) => {
            alert("Error on registration: " + JSON.stringify(error));
          });

          PushNotifications.addListener(
            "pushNotificationReceived",
            async (notification: PushNotificationSchema) => {
              // alert("Push received: " + JSON.stringify(notification));
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: notification.title || 'Notification Title',
                    body: notification.body || 'Notification Body',
                    id: Number(notification.id),
                    schedule: { at: new Date(Date.now() + 1000) },
                    actionTypeId: "",
                    extra: null,
                  },
                ],
              });
            }
          );

          PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (notification: ActionPerformed) => {
              alert("Push action performed: " + JSON.stringify(notification));
            }
          );
        },
      });
      this.router.navigate(["/events"]);
    } else {
      this.router.navigate(["/"]);
    }
  }
  ngOnInit() {
    if (this.userId) {
    }
  }
}
