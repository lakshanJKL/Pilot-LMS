import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {AsyncPipe, NgForOf} from "@angular/common";
import {map, Observable, startWith} from "rxjs";
import {MatButton} from "@angular/material/button";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import swAlert from "sweetalert";

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgForOf,
    MatButton,
  ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.scss'
})
export class NewCourseComponent implements OnInit {

  loading = false;
  teacherOptions: any[] = [];
  teacherObject: any[] = [];
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  // form controls
  teacherControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl("", [Validators.required]);
  titleControl = new FormControl("", [Validators.required]);


  constructor(private matDialog: MatDialog,
              private dataBase: AngularFirestore,
              private matSnackBar: MatSnackBar
  ) {
  }

  // create course
  saveBtn() {
    this.teacherObject.forEach((teacher) => {
      if (teacher.name == this.teacherControl.value) {

        const course = {
          title: this.titleControl.value,
          description: this.descriptionControl.value,
          teacherId: teacher.id
        }

        this.loading = true;

        this.dataBase.collection("courses").add(course).then(() => {
          this.matSnackBar.open("saved !", "close", {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 5000,
            direction: "ltr"
          });
          this.matDialog.closeAll();
          window.location.reload();
        }).catch(err => {

          swAlert("Error !", err).then();
        });
      }
    })
  }

  ngOnInit(): void {
    // load teachers to autocomplete field
    this.dataBase.collection("users").get().subscribe((querySnap) => {
      querySnap.forEach((doc) => {
        let users: any = doc.data();
        if (users.role == "teacher") {
          let teacher = {
            id: doc.id,
            name: users.name
          }
          this.teacherObject.push(teacher);
          this.teacherOptions.push(users.name);
        }
      });

      this.filteredOptions = this.teacherControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.teacherOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
