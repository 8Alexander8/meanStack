import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../shared/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      name: [""],
      email: [""],
      password: [""],
      image: ["default.jpeg"],
      biz: true,
    });
  }

  ngOnInit() {}

  registerUser() {
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      if (res._id) {
        this.toastr.success("You signed up successfuly !");
        console.log(res);
        this.signupForm.reset();
        this.router.navigate(["log-in"]);
      }
    });
  }
}
