import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient, private _router: Router) {}

  baseURL: string = "http://localhost:3000/api";

  getUsers() {
    return this.http.get<any>(this.baseURL + "/getAllUser");
  }

  addUser(data) {
    return this.http.post<any>(this.baseURL + "/addUser", data);
  }

  getUserById(id) {
    return this.http.get<any>(this.baseURL + "/getUserById/" + id);
  }

  editUser(user) {
    return this.http.put(this.baseURL + "/editUser/" + user._id, user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(this.baseURL + "/deleteUser/" + id);
  }
}
