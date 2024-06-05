import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {NewCourseComponent} from "./popup/new-course/new-course.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {UserService} from "../../../../../../services/user.service";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    MatIcon,
    RouterLink,
    NgIf
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit{
  newCourseState:any;
  manageBtnState: any;

  constructor(private matDialog:MatDialog,
              private userService:UserService
  ) {
  }

  newCourse() {
     this.matDialog.open(NewCourseComponent);
  }

  ngOnInit(): void {

    if (this.userService.globalUserRole == "student"){
       this.newCourseState = false;
       this.manageBtnState = false;

    }else if(this.userService.globalUserRole == "teacher"){
      this.newCourseState = true;
      this.manageBtnState = false;

    }else {
      this.newCourseState = true;
      this.manageBtnState = true;

    }

  }
}
