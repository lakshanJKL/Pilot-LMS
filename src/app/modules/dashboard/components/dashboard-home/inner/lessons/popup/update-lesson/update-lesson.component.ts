import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NewLessonComponent} from "../new-leasson/new-leasson.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-update-lesson',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
    templateUrl: './update-lesson.component.html',
    styleUrl: './update-lesson.component.scss'
})
export class UpdateLessonComponent implements OnInit {

    // form controls
    descriptionControl = new FormControl("", [Validators.required]);
    titleControl = new FormControl("", [Validators.required]);

    // variables
    loading = false;

    constructor(private matDialog: MatDialog,
                private dataBase: AngularFirestore,
                private router: Router,
                private matSnackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) private data: any
    ) {
    }

    // update lesson
    updateBtn() {
        this.loading = true;

        const lesson = {
            content: this.descriptionControl.value,
            courseId: this.data.courseId,
            title: this.titleControl.value,
        }

        const lessonRef = this.dataBase.collection("lessons").doc(this.data.lessonId);
        lessonRef.update(lesson).then(() => {
            this.matSnackBar.open("updated !", "close", {
                horizontalPosition: "center",
                verticalPosition: "top",
                duration: 5000,
                direction: "ltr"
            });
            this.matDialog.closeAll();
            window.location.reload();
        });
    }

    ngOnInit() {
        this.titleControl.setValue(this.data.title);
        this.descriptionControl.setValue(this.data.content);
    }

}


