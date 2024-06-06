import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
