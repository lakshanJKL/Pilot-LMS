import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {NewLessonComponent} from "../new-leasson/new-leasson.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {NgForOf, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UpdateLessonComponent} from "../update-lesson/update-lesson.component";
import {UserService} from "../../../../../../../../services/user.service";
import swAlert from "sweetalert";

@Component({
  selector: 'app-all-lessons',
  standalone: true,
  imports: [
    MatFabButton,
    MatTooltip,
    MatMiniFabButton,
    MatButton,
    MatExpansionModule,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    NgIf,
    NgForOf
  ],
  templateUrl: './all-lessons.component.html',
  styleUrl: './all-lessons.component.scss'
})
export class AllLessonsComponent implements OnInit {

  panelOpenState = false;
  courseTitle: any;
  lessonObject: any[] = [];
  newLessonState: any;
  updateDeleteLessonState: any;

  constructor(private dialog: MatDialog,
              private dataBase: AngularFirestore,
              private matSnackBar: MatSnackBar,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  //create lesson
  createLesson() {
    this.dialog.closeAll();
    this.dialog.open(NewLessonComponent, {
      data: {
        id: this.data.id
      }
    });
  }

  // update lesson
  updateLesson(lessonId: any, title: any, content: any) {
    this.dialog.open(UpdateLessonComponent, {
      data: {
        courseId: this.data.id,
        lessonId: lessonId,
        title: title,
        content: content
      }
    })
  }

  // delete lesson
  deleteLesson(id: any) {

    swAlert({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this lesson?",
      icon: "warning",
      dangerMode: true

    }).then(willDelete => {
        if (willDelete) {
          this.dataBase.collection("lessons").doc(id).delete().then(() => {
            this.matSnackBar.open("successfully deleted !", "close", {
              duration: 5000,
              direction: "ltr",
              horizontalPosition: "center",
              verticalPosition: "top"
            });
            this.dialog.closeAll();
            window.location.reload();
          });
        }
      }
    );
  }

  private loadLessons = () => {
    this.dataBase.collection("lessons").get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let lessonData: any = doc.data();
          if (lessonData.courseId == this.data.id) {
            const lessonsValue = {
              id: doc.id,
              values: doc.data()
            }
            this.lessonObject.push(lessonsValue);
          }
        });
      });
  }


  ngOnInit(): void {
    if (this.userService.globalUserRole == "student") {
      this.newLessonState = false;
      this.updateDeleteLessonState = false;

    } else if (this.userService.globalUserRole == "teacher") {
      this.newLessonState = true;
      this.updateDeleteLessonState = true;

    } else {
      this.newLessonState = true;
      this.updateDeleteLessonState = true;

    }

    this.courseTitle = this.data.title;
    this.loadLessons();
  }

}
