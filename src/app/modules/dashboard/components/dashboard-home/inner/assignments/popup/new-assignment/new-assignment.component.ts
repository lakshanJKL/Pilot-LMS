import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {map, Observable, startWith} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  MatCalendarCellClassFunction,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from '@angular/material/core';
import swAlert from "sweetalert";

@Component({
  selector: 'app-new-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './new-assignment.component.html',
  styleUrl: './new-assignment.component.scss'
})
export class NewAssignmentComponent implements OnInit {

  loading = false;
  lessonsOptions: any[] = [];
  lessonObject: any[] = [];
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  // form controls
  lessonControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl("", [Validators.required]);
  titleControl = new FormControl("", [Validators.required]);
  dateControl = new FormControl("", [Validators.required]);

  constructor(private matDialog: MatDialog,
              private dataBase: AngularFirestore,
              private matSnackBar: MatSnackBar
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
  saveBtn() {
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
          this.dataBase.collection("assignments").add(assignment).then(() => {
            this.matSnackBar.open("Saved !", "close", {
              duration: 5000,
              direction: "ltr",
              horizontalPosition: "center",
              verticalPosition: "top"
            });
            this.matDialog.closeAll();
            window.location.reload();

          }).catch(err => {
            swAlert("Error !", err).then();
          });

        }
      });

    });
  }

  ngOnInit(): void {

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

