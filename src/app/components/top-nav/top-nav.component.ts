import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./../../shared/auth.service";

@Component({
  selector: "app-top-nav",
  templateUrl: "./top-nav.component.html",
  styleUrls: ["./top-nav.component.css"],
})
export class TopNavComponent implements OnInit {
  id: string =localStorage.getItem("UID");
  constructor(
    public authService: AuthService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
 
  }
  logout() {
    this.authService.doLogout();
  }
}
