import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs";
import { AccountService } from "../../_services/account.service";
import { ToastComponent } from "../../shared/toast/toast.component";
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { NotificationService } from "../../_services/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  @ViewChild(ToastComponent) toast: ToastComponent;
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  errorMessage: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) {
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit(e: any) {
    e.preventDefault();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.accountService.getMyInfo().subscribe({
            next: (userData: any) => {
              const userId = userData.result.id;
              console.log('Registering Push Noti', userId);
              PushNotifications.requestPermissions().then((result) => {
                if (result.receive === "granted") {
                  PushNotifications.register();
                } else {
                  console.log("Permission denied");
                }
              });
              PushNotifications.addListener("registration", (token: Token) => {
                console.log('UserID: ', userId)
                if (userId) {
                  this.notificationService
                    .registerToken(userId, token.value)
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
          this.toast.openToast("Login Successfully", "fa-check");
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/events";
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.errorMessage = [];
          this.errorMessage.push(error);
          this.loading = false;
        },
      });
  }
//   async onSubmit(e: any) {
//     debugger
//     e.preventDefault();
//     this.submitted = true;

//     // Stop if the form is invalid
//     if (this.form.invalid) {
//       return;
//     }

//     this.loading = true;

//     try {
//         // Await the login function, which now returns a Promise
//         await this.accountService.login(this.f.username.value, this.f.password.value);

//         // Show success toast
//         this.toast.openToast("Login Successfully", "success", "fa-check");

//         // Navigate to the return URL or the root
//         const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
//         this.router.navigateByUrl(returnUrl);

//     } catch (error) {
//         // Handle error (e.g., show an error message, stop loading)
//         console.error('Login failed', error);
//     } finally {
//         this.loading = false;
//     }
// }

}
