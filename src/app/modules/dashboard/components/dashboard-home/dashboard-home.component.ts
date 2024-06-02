import {Component, OnInit, Renderer2} from '@angular/core';
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {CookieManagementService} from "../../../../services/cookie-management.service";
import {Router, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    MatIcon,
    MatMiniFabButton,
    MatTooltip
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit{
  userEmail: any="admin@gmail.com";
  role: any="Student";

  constructor(private renderer:Renderer2,
              private router:Router,
              private cookieManagementService:CookieManagementService
  ) {
  }

  logout() {
    this.cookieManagementService.deleteCookie("userData");
    this.router.navigateByUrl("/login").then();
  }
  ngOnInit(): void {
    this.renderer.setStyle(document.body,
      'background-image','none');
  }


}
