import {Component, OnInit} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {UpdateAssignmentsComponent} from "../popup/update-assignments/update-assignments.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import {UserService} from "../../../../../../../services/user.service";
import {ViewComponent} from "../popup/view/view.component";
import {CookieManagementService} from "../../../../../../../services/cookie-management.service";
import swAlert from "sweetalert";


@Component({
  selector: 'app-all-assignments',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    NgForOf,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    AsyncPipe,
    MatButton,
    DatePipe
  ],
  templateUrl: './all-assignments.component.html',
  styleUrls: ['./all-assignments.component.scss']
})
export class AllAssignmentsComponent implements OnInit {

  panelOpenState: boolean = false;
  pdfFile: any;
  selectedFile: any;
  uploadRate: Observable<any> | undefined;
  downloadLink: Observable<string | undefined> | undefined;
  loading: any = false;
  assignmentObject: any[] = [];
  getUserid: any;
  viewBtnState: any;
  updateBtnState: any;
  deleteBtnState: any;
  submitBtnState: any;
  attachState: any;

  constructor(private dataBase: AngularFirestore,
              private matDialog: MatDialog,
              private matSnackBar: MatSnackBar,
              private userService: UserService,
              private storage: AngularFireStorage
  ) {
  }

  // load View popup window
  viewBtn(title: any) {
    this.matDialog.open(ViewComponent, {
      data: {
        assignmentTitle: title
      }
    });
  }

  // Delete assignment
  deleteAssignment(assignmentId: any) {
    swAlert({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this assignment?",
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          this.dataBase.collection("assignments").doc(assignmentId).delete().then(() => {
            this.matSnackBar.open("Successfully deleted!", "close", {
              duration: 5000,
              direction: "ltr",
              horizontalPosition: "center",
              verticalPosition: "top",
            });
            window.location.reload();
          }).catch(err => {
            swAlert("Error !", err).then();
          });
        }
      });
  }

  //load  Update assignment popup window
  updateBtn(id: any, title: any, dueDate: any, desc: any, lessonName: any) {
    this.matDialog.open(UpdateAssignmentsComponent, {
      data: {
        assignmentId: id,
        assignmentTitle: title,
        lessonName: lessonName,
        assignmentDueDate: dueDate,
        assignmentDesc: desc
      }
    });
  }


  // catch selected file
  onChangeFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Assignment submission
  submitAssignment(assignmentId: any) {
    if (this.selectedFile == null) {
      swAlert("Alert !", "Please select your file").then();

    } else {
      this.loading = true;
      const path = "files/" + "studentName/" + this.selectedFile.name;
      const fileRef = this.storage.ref(path);
      const task = this.storage.upload(path, this.selectedFile);

      this.uploadRate = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadLink = fileRef.getDownloadURL();
        })
      ).subscribe();

      task.then(() => {

        this.downloadLink?.subscribe((resp: any) => {
          const updateSubmissions = this.dataBase.collection("assignments").doc(assignmentId);

          updateSubmissions.get().subscribe((doc) => {

            if (doc.exists) {
              const assignmentData: any = doc.data();
              const currentSubmissions = assignmentData.studentSubmissions || [];

              currentSubmissions.push({
                studentId: this.getUserid,
                pdfFile: resp
              });

              updateSubmissions.update({studentSubmissions: currentSubmissions}).then(() => {
                this.matSnackBar.open("Assignment submitted!", "close", {
                  direction: "ltr",
                  duration: 5000,
                  horizontalPosition: "center",
                  verticalPosition: "top"
                });
                window.location.reload();

              }).catch(err => {

                swAlert("Error !", err).then();
              });
            }
          });
        });
      });
    }
  }


  // Get user id from database
  private getEmail = (getEmail: any): any => {
    this.dataBase.collection("users").get(getEmail)
      .subscribe((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          let usersData: any = doc.data();

          if (usersData.email == getEmail) {
            this.getUserid = doc.id;
          }
        });
      });
  }

  private loadAssignments = () => {
    this.dataBase.collection("assignments").get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((assignmentDoc) => {
          let assignmentData: any = assignmentDoc.data();

          // Convert Firestore timestamp to Date object
          let dueDate: Date = assignmentData.dueDate.toDate();

          this.dataBase.collection("lessons").get()
            .subscribe((querySnapshot) => {
              querySnapshot.forEach((lessonDoc) => {

                let lessonsData: any = lessonDoc.data();

                if (assignmentData.lessonId == lessonDoc.id) {

                  const assignmentValues = {
                    assignmentId: assignmentDoc.id,
                    assignmentTitle: assignmentData.title,
                    dueDate: dueDate,
                    lessonName: lessonsData.title,
                    assignmentDesc: assignmentData.description
                  }
                  this.assignmentObject.push(assignmentValues);

                }
              });
            });
        });
      });
  }

  ngOnInit(): void {
    if (this.userService.globalUserRole == "student") {
      this.attachState = true;
      this.viewBtnState = false;
      this.updateBtnState = false;
      this.deleteBtnState = false;
      this.submitBtnState = true;


    } else if (this.userService.globalUserRole == "teacher") {
      this.attachState = false;
      this.viewBtnState = true;
      this.updateBtnState = true;
      this.deleteBtnState = true;
      this.submitBtnState = false;

    } else {
      this.attachState = true;
      this.viewBtnState = true;
      this.updateBtnState = true;
      this.deleteBtnState = true;
      this.submitBtnState = true;
    }

    this.getEmail(this.userService.globalUserEmail);
    this.loadAssignments();
  }
}
