import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./../../shared/auth.service";
import { FileUploader } from "ng2-file-upload";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

//Url for images to upload(FileUploader)
const URL = "http://localhost:3000/api/upload";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  //Image Upload
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: "image",
  });
  currentUser: Object = {};
  imgUrl: string;
  image: object = {};

  constructor(
    private router: Router,
    public authService: AuthService,
    private actRoute: ActivatedRoute,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    let id = this.actRoute.snapshot.paramMap.get("id");
    this.authService.getUserProfile(id).subscribe((res) => {
      this.currentUser = res;
      this.imgUrl =
        "http://localhost:3000/uploads/images/" + this.currentUser["image"];
      console.log(this.currentUser);
    });
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    //Upload image and change the src in img to the new image
    this.uploader.onCompleteItem = (item: any, res: string) => {
      console.log("Uploaded File Details: " + res);
      this.authService.updateUser(this.currentUser["_id"], { image: res });
      this.imgUrl =
        "http://localhost:3000/uploads/images/" + this.currentUser["image"];
      this.router
        .navigateByUrl("/RefreshComponent", { skipLocationChange: true })
        .then(() => {
          this.router.navigate(["user-profile/" + this.currentUser["_id"]]);
        });
      this.toastr.success("File successfully uploaded!");
    };
  }
}
