import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NewCourseComponent} from "../courses/popup/new-course/new-course.component";
import {NewAssignmentComponent} from "./popup/new-assignment/new-assignment.component";
import {NgIf} from "@angular/common";
import {UserService} from "../../../../../../services/user.service";

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    RouterLink,
    NgIf
  ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit {

  //variables
  manageBtnState: any;
  newAssignmentBtnState: any;

  constructor(private matDialog: MatDialog,
              private userService: UserService
  ) {
  }

  newAssignment() {
    this.matDialog.open(NewAssignmentComponent);
  }

  ngOnInit(): void {
    if (this.userService.globalUserRole == "student") {
      this.manageBtnState = false;
      this.newAssignmentBtnState = false;

    } else if (this.userService.globalUserRole == "teacher") {
      this.manageBtnState = false;
      this.newAssignmentBtnState = true;

    } else {
      this.manageBtnState = true;
      this.newAssignmentBtnState = true;
    }
  }
}
