import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {UpdateCourseComponent} from "../popup/update-course/update-course.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AllLessonsComponent} from "../../lessons/popup/all-lessons/all-lessons.component";
import {UserService} from "../../../../../../../services/user.service";
import {flush} from "@angular/core/testing";

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [MatTableModule,
    NgForOf,
    MatIcon,
    MatFabButton,
    MatTooltip,
    MatMiniFabButton,
    NgIf,
    NgClass],
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent implements OnInit {

  @ViewChild("tableRow", {static: true}) tableRow: any;
  courseObject: any[] = [];
  isState: boolean[] = Array(this.courseObject.length).fill(false);
  updateCourseState: any;
  deleteCourseState: any;
  enrollState: any;


  constructor(private database: AngularFirestore,
              private matDialog: MatDialog,
              private matSnackBar: MatSnackBar,
              private router: Router,
              private userService: UserService
  ) {
  }

// visible & hide buttons (update,lessons,delete)
  visibleButtons(index: number) {
    this.isState[index] = true;
  }

  hideButtons() {
    this.isState = Array(this.courseObject.length).fill(false);
  }

  // left & right side buttons
  rightSide() {
    this.tableRow.nativeElement.scrollBy({left: 250, behavior: 'smooth'});
  }

  leftSide() {
    this.tableRow.nativeElement.scrollBy({left: -250, behavior: 'smooth'});
  }

  // lessons popup window
  lessonsWindow(id: any, title: any) {
    if (this.enrollState == false) {
      alert("Please enroll in  " + title + " course");

    } else {
      this.matDialog.open(AllLessonsComponent, {
        data: {
          id: id,
          title: title
        }
      });
    }
  }

// update course
  updateCourse(id: any, title: any, teacherName: any, description: any) {
    this.matDialog.open(UpdateCourseComponent, {
      data: {
        id: id,
        title: title,
        teacherName: teacherName,
        description: description
      }
    });
  }

  deleteCourse(id: any) {
    if (confirm("Are you sure?")) {
      const courseObj = this.database.collection("courses").doc(id);
      courseObj.delete().then(() => {
        this.matSnackBar.open("successfully deleted !", "close", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 5000,
          direction: "ltr"

        });
        this.matDialog.closeAll();
        window.location.reload();

      });
    }
  }

  getCourses = () => {
    this.database.collection("courses").get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((courseDoc) => {

          let courseData: any = courseDoc.data();
          this.database.collection("users").doc(courseData.teacherId).get()
            .subscribe((teacherDoc) => {
              let teacherData: any = teacherDoc.data();
              if (teacherData && teacherData.role === 'teacher') {
                this.courseObject.push({
                  id: courseDoc.id,
                  title: courseData.title,
                  teacherName: teacherData.name,
                  description: courseData.description
                });
              }
            });
        });
      });
  }

// enroll the course
  enrollBtn(index: any) {
    if (confirm("Do you want to enroll in this course ?")) {
      this.enrollState = true;
      // if(id == courses.id){
      //   this.enrollState = true;
      // }

    }
  }

  ngOnInit(): void {
    if (this.userService.globalUserRole == "student") {
      this.enrollState = false;
      this.updateCourseState = false;
      this.deleteCourseState = false;

    } else if (this.userService.globalUserRole == "teacher") {
      this.enrollState = false;
      this.updateCourseState = true;
      this.deleteCourseState = true;

    } else {
      this.enrollState = false;
      this.updateCourseState = true;
      this.deleteCourseState = true;

    }
    this.getCourses();
  }


}
