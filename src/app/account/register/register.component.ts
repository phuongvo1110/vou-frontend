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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        username: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
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
  onSubmit(e: any) {
    e.preventDefault();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const userData = {
      ...this.form.value,
      roles: ["player"]
    }
    this.loading = true;
    this.accountService.register(userData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
  }
}
