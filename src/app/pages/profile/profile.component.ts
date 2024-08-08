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

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  @ViewChild(ToastComponent) toast: ToastComponent;
  profileForm: FormGroup;
  genderOptions = [
    { id: "1", name: "Male", value: "male" },
    { id: "2", name: "Female", value: "female" },
    { id: "3", name: "Other", value: "other" },
  ];
  dateofbirth = "";
  constructor(public formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      fullname: [undefined, [Validators.required]],
      gender: [undefined, [Validators.required]],
      email: [undefined, [Validators.required, Validators.email]],
      dob: [undefined],
      facebook: [undefined],
      phoneNumber: [undefined, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')],
    });
  }
  getDate(data: string) {
    if (data) {
      this.dateofbirth = data;
    }
  }
  onSubmit() {
    const formData = {
      ...this.profileForm.value,
      dob: this.dateofbirth,
    };
    if (this.profileForm.invalid) {
      this.toast.openToast('Cập nhật thành công', 'success', 'fa-check')
      console.log(this.toast);
      console.log('Error');
      return;
    }
    console.log(formData);
  }
}
