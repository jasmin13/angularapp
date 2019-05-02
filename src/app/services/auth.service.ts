import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseUrl: String = "http://localhost:3000/api";
  private _registerUrl = this.baseUrl + "/register";
  private _loginUrl = this.baseUrl + "/login";
  private _logoutUser = this.baseUrl + "/logout";

  constructor(private http: HttpClient, private _router: Router) {}

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logoutUser() {
    this.http.get<any>(this._logoutUser);
    localStorage.removeItem("token");
    this._router.navigate(["/login"]);
  }
}
