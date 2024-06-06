import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatRadioButton, MatRadioGroup, MatRadioModule} from "@angular/material/radio";
import {MatSnackBar} from "@angular/material/snack-bar";
import swAlert from "sweetalert";

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatTableModule,
    MatExpansionPanel,
    MatRadioModule,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  userObject: any[] = [];
  color: any = "rgba(255,0,0,0.51)";
  userRoleRdBtn: any = new FormControl("");
  teacherCheckRole: boolean = false;
  studentCheckRole: boolean = false;
  adminCheckRole: boolean = false;

  constructor(private dataBase: AngularFirestore,
              private matSnackBar: MatSnackBar
  ) {
  }

// delete user
  deleteUser(userId: any) {
    swAlert({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this user?",
      icon: "warning",
      dangerMode: true,

    }).then(willDelete => {
      if (willDelete) {
        this.dataBase.collection("users").doc(userId).delete().then(() => {
          this.matSnackBar.open("Successfully deleted !", "close", {
            direction: "ltr",
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top"
          })
          window.location.reload();
        }).catch(err => {
          swAlert("Error !", err).then();
        });
      }
    });
  }

  // update user role
  changeUserRole(userId: any, rowNum: number) {
    const userRef = this.dataBase.collection("users").doc(userId);
    userRef.update({role: this.userRoleRdBtn.value}).then(() => {
      this.matSnackBar.open("Updated !", "close", {
        direction: "ltr",
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top"
      })

    }).catch(err => {
      swAlert("Error !", err).then();
    });
  }

  private loadUsers = () => {
    this.dataBase.collection("users").get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let userData: any = doc.data();

          if (userData.role == "teacher") {
            this.teacherCheckRole = true;
            this.studentCheckRole = false;
            this.adminCheckRole = false;

          } else if (userData.role == "student") {
            this.teacherCheckRole = false;
            this.studentCheckRole = true;
            this.adminCheckRole = false;

          } else {
            this.teacherCheckRole = false;
            this.studentCheckRole = false;
            this.adminCheckRole = true;
          }

          const tableData = {
            userId: doc.id,
            userName: userData.name,
            userEmail: userData.email,
            userRole: userData.role,
            teacherChecked: this.teacherCheckRole,
            studentChecked: this.studentCheckRole,
            adminChecked: this.adminCheckRole

          }

          this.userObject.push(tableData);
        });
      });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

}
