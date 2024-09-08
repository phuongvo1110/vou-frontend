import { NgClass, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs";
import { AccountService } from "../../_services/account.service";
import { User } from "../../_models/user";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  checkCreated: boolean = false;
  userRegister: any;
  otpInput: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        username: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
        phone: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-9]|9[0-9])[0-9]{7}$/
            ),
          ],
        ]
      },
      {
        validator: this.passwordMatchValidator, // Attach the custom validator here
      }
    );
  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPass = control.get("confirmPass");

    if (password && confirmPass && password.value !== confirmPass.value) {
      return { passwordMismatch: true };
    }

    return null;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  onInput(e: any) {
    this.otpInput = e;
  }
  onSubmit(e: any) {
    e.preventDefault();
    
    
    if (!this.checkCreated) {
      this.submitted = true;
      const userData = {
        ...this.form.value,
        roles: ["player"],
        phone: "+84" + this.form.controls["phone"].value,
      };
      this.userRegister = userData;
    } else {
      const userData = {
        ...this.userRegister,
        otp: this.otpInput,
      };
      this.userRegister = userData;
    }
    this.loading = true;
    if (!this.checkCreated) {
      this.accountService
        .register(this.userRegister)
        .pipe(first())
        .subscribe({
          next: () => {
            this.checkCreated = true;
            // this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (error) => {
            this.loading = false;
          },
        });
    } else {
      this.accountService.verifyOTP(this.userRegister).subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.loading = false;
        },
      })
    }
  }
}
