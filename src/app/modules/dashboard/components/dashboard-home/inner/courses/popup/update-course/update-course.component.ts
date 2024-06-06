import {Component, Inject, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {map, Observable, startWith} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import swAlert from "sweetalert";

@Component({
  selector: 'app-update-course',
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
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent implements OnInit {

  loading: boolean = false;
  teacherOptions: any[] = [];
  teacherObject: any[] = [];
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  // form controls
  teacherControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl("", [Validators.required]);
  titleControl = new FormControl("", [Validators.required]);

  constructor(private matDialog: MatDialog,
              private dataBase: AngularFirestore,
              private matSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  // update course
  updateBtn() {
    this.teacherObject.forEach((teacher) => {
      if (teacher.name == this.teacherControl.value) {

        const course = {
          title: this.titleControl.value,
          description: this.descriptionControl.value,
          teacherId: teacher.id
        }

        this.loading = true;

        const courseRef = this.dataBase.collection("courses").doc(this.data.id);
        courseRef.update(course).then(() => {
          this.matSnackBar.open("updated !", "close", {
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

  private loadCourseData = () => {
    this.titleControl.setValue(this.data.title);
    this.teacherControl.setValue(this.data.teacherName);
    this.descriptionControl.setValue(this.data.description);
  }

  ngOnInit(): void {
    this.loadCourseData();

    // load teachers to autocomplete field
    this.dataBase.collection("users").get()
      .subscribe((querySnap) => {
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
