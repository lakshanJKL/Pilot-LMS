import {Component, OnInit, Renderer2} from '@angular/core';
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {CookieManagementService} from "../../../../services/cookie-management.service";
import {Router, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {UserService} from "../../../../services/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatFabButton
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  userEmail: any;
  role: any;

  constructor(private renderer: Renderer2,
              private router: Router,
              private database: AngularFirestore,
              private userService: UserService,
              private cookieManagementService: CookieManagementService
  ) {
  }


  // user logout
  logout() {
    this.cookieManagementService.deleteCookie("userData");
    this.router.navigateByUrl("/login").then();
  }

  private getEmail = (getEmail: any) => {
    this.database.collection("users").get(getEmail)
      .subscribe((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          let usersData: any = doc.data();

          if (usersData.email == getEmail) {
            this.userEmail = usersData.email;
            console.log(usersData.email);
          }
        });
      });
  }

  ngOnInit(): void {
    const stringUserData = this.cookieManagementService.findCookieValue("userData");

    if (stringUserData) {
      const userDataValue = JSON.parse(stringUserData);
      this.userEmail = userDataValue.userEmail;
      this.role = userDataValue.userRole;
      this.userService.globalUserEmail = userDataValue.userEmail;
      this.userService.globalUserRole = userDataValue.userRole;
    }

    if (this.userService.globalUserRole == "student") {
      this.role = "Student";

    } else if (this.userService.globalUserRole == "teacher") {
      this.role = "Teacher";

    } else {
      this.role = "Admin";

    }

    this.renderer.setStyle(document.body,
      'background-image', 'none');
  }


}
