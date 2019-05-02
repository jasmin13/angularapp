import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../services/user.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"]
})
export class EditComponent implements OnInit {
  submitted: boolean = false;
  invalidUser: boolean = false;
  validUser: boolean = false;
  userResponse: string;
  editUserForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {}

  ngOnInit() {
    /* let userId = localStorage.getItem("editUserId");
    console.log(userId); */
    /* if (!userId) {
      alert("Invalid action.");
      this._router.navigate(["/home"]);
      return;
    } */

    this.editUserForm = this.formBuilder.group({
      _id: [],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("[6-9]\\d{9}")]]
    });

    this.route.params.subscribe(params => {
      this._userService.getUserById(params["id"]).subscribe(data => {
        const { uid, __v, ...res } = data;

        this.editUserForm.setValue(res);
      });
    });
  }

  get firstname() {
    return this.editUserForm.get("firstname");
  }

  get lastname() {
    return this.editUserForm.get("lastname");
  }

  get email() {
    return this.editUserForm.get("email");
  }

  get phone() {
    return this.editUserForm.get("phone");
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editUserForm.invalid) {
      return;
    }

    this._userService
      .editUser(this.editUserForm.value)
      .pipe(first())
      .subscribe(
        res => {
          this.validUser = true;
          this.userResponse = res["success"];
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
