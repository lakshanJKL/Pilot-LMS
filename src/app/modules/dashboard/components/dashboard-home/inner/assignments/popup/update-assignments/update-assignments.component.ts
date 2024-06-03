import {Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {
  MatCalendarCellClassFunction,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {map, Observable, startWith} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-update-assignments',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatOption,
    MatSuffix,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './update-assignments.component.html',
  styleUrl: './update-assignments.component.scss'
})
export class UpdateAssignmentsComponent implements OnInit {
  // form controls
  lessonControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl("", [Validators.required]);
  titleControl = new FormControl("", [Validators.required]);
  dateControl = new FormControl("", [Validators.required]);

  // variables
  loading = false;
  lessonsOptions: any[] = [];
  lessonObject: any[] = [];
  filteredOptions: Observable<string[]> = new Observable<string[]>();


  constructor(private matDialog: MatDialog,
              private dataBase: AngularFirestore,
              private router: Router,
              private matSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data:any
  ) {
  }

  //date picker
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };


  // create assignment
  updateBtn() {
    this.loading=true;
    this.dataBase.collection("lessons").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let lessons: any = doc.data();

        if (lessons.title == this.lessonControl.value) {

          const assignment = {
            description: this.descriptionControl.value,
            dueDate: this.dateControl.value,
            lessonId: doc.id,
            studentSubmissions: "",
            title: this.titleControl.value
          }

         const assignmentRef = this.dataBase.collection("assignments").doc(this.data.assignmentId);
          assignmentRef.update(assignment).then(()=>{

            this.matSnackBar.open("updated !", "close", {
              duration: 5000,
              direction: "ltr",
              horizontalPosition: "center",
              verticalPosition: "top"
            });
            this.matDialog.closeAll();
            window.location.reload();
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.titleControl.setValue(this.data.assignmentTitle);
    this.lessonControl.setValue(this.data.lessonName);
    this.dateControl.setValue(this.data.assignmentDueDate);
    this.descriptionControl.setValue(this.data.assignmentDesc);


    // load teachers to autocomplete field
    this.dataBase.collection("lessons").get().subscribe((querySnap) => {
      querySnap.forEach((doc) => {
        let lessonsData: any = doc.data();
        let lessons = {
          id: doc.id,
          name: lessonsData.title
        }
        this.lessonObject.push(lessons);
        this.lessonsOptions.push(lessonsData.title);

      });

      this.filteredOptions = this.lessonControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.lessonsOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}

