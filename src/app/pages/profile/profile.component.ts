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
  genderOptions = [
    { id: "1", name: "Male", value: "male" },
    { id: "2", name: "Female", value: "female" },
    { id: "3", name: "Other", value: "other" },
  ];
  dateofbirth = "";
  constructor(
    public formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    const myInfo = this.accountService.getMyInfo().subscribe();
    console.log(myInfo);
    this.profileForm = this.formBuilder.group({
      fullName: [undefined, [Validators.required]],
      username: [undefined],
      gender: [undefined, [Validators.required]],
      email: [undefined, [Validators.required, Validators.email]],
      dateOfBirth: [undefined],
      facebookAccount: [undefined],
      phone: [
        undefined,
        Validators.pattern(
          "(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})"
        ),
      ],
    });
  }
  get f() {
    return this.profileForm.controls;
  }
  getDate(data: string) {
    if (data) {
      this.dateofbirth = data;
    }
  }
  onSubmit(e: any) {
    this.submitted = true;
    const formData = {
      ...this.profileForm.value,
      dateOfBirth: this.dateofbirth,
    };
    if (this.profileForm.invalid) {
      this.toast.openToast("Update Successfully", "success", "fa-check");
      console.log(this.toast);
      console.log(formData);
      return;
    }
    console.log(formData);
  }
  logout() {
    this.accountService.logout();
  }
}
