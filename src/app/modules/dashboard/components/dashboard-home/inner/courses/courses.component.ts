import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {NewCourseComponent} from "./popup/new-course/new-course.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet
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
