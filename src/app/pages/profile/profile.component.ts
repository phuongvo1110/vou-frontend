import { Component, OnInit, ViewChild } from "@angular/core";
import { HeaderComponent } from "../../shared/header/header.component";
import { InputComponent } from "../../shared/input/input.component";
import { ComboboxComponent } from "../../shared/combobox/combobox.component";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DatepickerComponent } from "../../shared/datepicker/datepicker.component";
import { DatePipe } from "@angular/common";
import { ToastComponent } from "../../shared/toast/toast.component";
import { User } from "../../_models/user";
import { AccountService } from "../../_services/account.service";
import { first } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  @ViewChild(ToastComponent) toast: ToastComponent;
  user?: User | null;
  profileForm: FormGroup;
  loading = false;
  submitted = false;
  accountId: string = "";
  userId: string = "";
  messageProfile: string = "";
  genderOptions = [
    { id: "1", name: "Male", value: "male" },
    { id: "2", name: "Female", value: "female" },
    { id: "3", name: "Other", value: "other" },
  ];
  dateofbirth: string | undefined = "";
  constructor(
    public formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      fullName: [undefined, [Validators.required]],
      username: [undefined],
      gender: [undefined, [Validators.required]],
      email: [undefined, [Validators.required, Validators.email]],
      dateOfBirth: [undefined],
      facebookAccount: [undefined],
      phone: [undefined],
    });
    // this.accountService.user.subscribe((x) => (this.user = x));
    this.accountService.getMyInfo().subscribe({
      next: (userData: any) => {
        console.log(userData);
        this.accountId = userData.result.id;
        console.log('accountId: ', this.accountId);
        this.profileForm.patchValue({
          username: userData.result.username,
        });
        this.accountService.getById(this.accountId).subscribe({
          next: (data: User) => {
            this.user = data;
            console.log('Userwefewfw', this.user);
            this.profileForm.patchValue(data);
            this.dateofbirth = data.dateOfBirth;
            this.messageProfile = "Update Profile";
          },
          error: (error) => {
            console.error("Error:", error);
            console.log('Userwefewfw', this.user);
            this.messageProfile = "Create Profile";
          },
        });
      },
    });
  }
  ngOnInit() { }
  get f() {
    return this.profileForm.controls;
  }
  getDate(selectedDate: string) {
    if (selectedDate) {
      this.dateofbirth = selectedDate;
      this.profileForm.patchValue({ dateOfBirth: selectedDate });
    }
  }
  onSubmit(e: any) {
    this.submitted = true;
    const formData = {
      ...this.profileForm.value,
      dateOfBirth: this.dateofbirth,
      accountId: this.accountId,
      role: "player",
      status: true,
      avatar: "avatar_url",
      turns: 10,
    };
    if (this.profileForm.invalid) {
      return;
    }
    console.log(formData);
    !this.user ? this.accountService
      .createProfile(this.accountId, formData)
      .pipe(first())
      .subscribe({
        next: (data) => {
          console.log(data);
          this.toast.openToast("Create Profile Successfully", "fa-check");
          this.messageProfile = "Update Profile";
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
        },
      }) : this.accountService
        .update(this.user.id as string, formData)
        .pipe(first())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.toast.openToast("Update Profile Successfully", "fa-check");
            this.messageProfile = "Update Profile";
          },
          error: (error) => {
            console.error(error);
            this.loading = false;
          },
        })
  }
  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (err: any) => {
        console.error("Logout failed:", err);
      }
    });
  }

}
