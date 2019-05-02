import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  submitted: boolean = false;
  invalidUser: boolean = false;
  validUser: boolean = false;
  userResponse: string;

  constructor(private _userService: UserService, private _router: Router) {}

  ngOnInit() {}

  addUserForm = new FormGroup({
    firstname: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern("[6-9]\\d{9}")
    ])
  });

  get firstname() {
    return this.addUserForm.get("firstname");
  }

  get lastname() {
    return this.addUserForm.get("lastname");
  }

  get email() {
    return this.addUserForm.get("email");
  }

  get phone() {
    return this.addUserForm.get("phone");
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addUserForm.invalid) {
      return;
    }

    this._userService.addUser(this.addUserForm.value).subscribe(
      res => {
        this.validUser = true;
        this.userResponse = res.success;
        this._router.navigate(["/home"]);
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          this.invalidUser = true;
          this.userResponse = err.error;
        }
      }
    );
  }
}
