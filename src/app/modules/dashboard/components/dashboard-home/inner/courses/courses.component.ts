import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {NewCourseComponent} from "./popup/new-course/new-course.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    MatIcon,
    RouterLink
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {

  constructor(private matDialog:MatDialog) {
  }

  newCourse() {
     this.matDialog.open(NewCourseComponent);
  }
}
