import {Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {map, Observable, startWith} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-leasson',
  standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './new-leasson.component.html',
  styleUrl: './new-leasson.component.scss'
})
export class NewLessonComponent implements OnInit {

  // form controls
  descriptionControl = new FormControl("", [Validators.required]);
  titleControl = new FormControl("", [Validators.required]);

  // variables
  loading = false;

  constructor(private matDialog: MatDialog,
              private dataBase: AngularFirestore,
              private router:Router,
              private matSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data:any
  ) {
  }

  // create lesson
  saveBtn() {
    this.loading = true;

    const lesson = {
      content:this.descriptionControl.value,
      courseId:this.data.id,
      title:this.titleControl.value,
    }

    this.dataBase.collection("lessons").add(lesson).then(() => {
      this.matSnackBar.open("saved !", "close", {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 5000,
        direction: "ltr"
      });
      this.matDialog.closeAll();
      window.location.reload();
    });
  }

  ngOnInit(){}

}

