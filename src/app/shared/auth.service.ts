import { Injectable } from "@angular/core";
import { User } from "./user";
import { Observable, throwError, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  endpoint: string = "http://localhost:3000/api";
  headers = new HttpHeaders().set("Content-Type", "application/json");
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {}

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/signup`;
    return this.http
      .post(api, user)
      .pipe(catchError((err) => of(this.toastr.error(err.error))));
  }

  // Sign-in
  signIn(user: User) {
    return this.http
      .post<any>(`${this.endpoint}/signin`, user)
      .pipe(catchError((err) => of(this.toastr.error(err.error))))
      .subscribe((res: any) => {
        localStorage.setItem("access_token", res.token);
        this.getUserProfile(res._id).subscribe((res) => {
          this.currentUser = res;
          this.toastr.success("Welcome " + this.currentUser["name"]);
          console.log(res);
          localStorage.setItem("UID", res._id);
          this.router.navigate(["user-profile/" + res._id]);
        });
      });
  }

  //Update user(Image)
  updateUser(id: string, data: object) {
    let api = `${this.endpoint}/user-profile/${id}`;
    console.log(data);
    this.http.patch(api, data).subscribe(
      (val) => {
        console.log("PATCH call successful value returned in body", val);
      },
      (response) => {
        console.log("PATCH call in error", response);
      },
      () => {
        console.log("The PATCH observable is now completed.");
      }
    );
  }

  getToken() {
    return localStorage.getItem("access_token");
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem("access_token");
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem("access_token");
    removeToken = localStorage.removeItem("UID");
    if (removeToken == null) {
      this.router.navigate(["log-in"]);
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
