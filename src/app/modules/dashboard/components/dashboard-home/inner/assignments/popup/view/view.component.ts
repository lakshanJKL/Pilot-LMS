import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    MatButton,
    NgForOf
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit {

  submittedData: any[] = [];

  constructor(private database: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  //open new window
  openBtn(file: any) {
    window.open(file);
  }

  ngOnInit(): void {
    this.database.collection("assignments").get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((assignmentDoc) => {
          let assignmentsData: any = assignmentDoc.data();

          if (this.data.assignmentTitle == assignmentsData.title) {

            this.database.collection("users").get()
              .subscribe((querySnap) => {
                querySnap.forEach((userDoc) => {

                  let usersData: any = userDoc.data();

                  assignmentsData.studentSubmissions.forEach((stId: any) => {

                    if ((stId.studentId == userDoc.id) && stId.pdfFile) {
                      this.submittedData.push({
                        studentEmail: usersData.email,
                        studentFile: stId.pdfFile
                      });
                    }
                  });
                });
              });
          }
        });
      });
  }
}
