import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NewCourseComponent} from "../courses/popup/new-course/new-course.component";
import {NewAssignmentComponent} from "./popup/new-assignment/new-assignment.component";

@Component({
  selector: 'app-assignments',
  standalone: true,
    imports: [
        MatButton,
        RouterOutlet,
        RouterLink
    ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent {
    constructor(private matDialog:MatDialog) {
    }

    newAssignment() {
        this.matDialog.open(NewAssignmentComponent);
    }
}
