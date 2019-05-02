import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  users: Object[];
  search: string = "";
  constructor(private _router: Router, private _userService: UserService) {}

  ngOnInit() {
    this._userService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  deleteUser(user): void {
    this._userService.deleteUser(user._id).subscribe(data => {
      console.log(data);
      this.users = this.users.filter(u => u !== user);
    });
  }

  addUser(): void {
    this._router.navigate(["/add"]);
  }
}
