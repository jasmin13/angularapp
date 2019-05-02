import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  invalidLogin: boolean = false;
  loginResponse: string;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit() {}

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this._auth.loginUser(this.loginForm.value).subscribe(
      res => {
        localStorage.setItem("token", res.token);
        this._router.navigate(["/home"]);
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.invalidLogin = true;
            this.loginResponse = err.error;
          }
        }
      }
    );
  }
}
