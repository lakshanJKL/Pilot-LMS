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
import {NewLeassonComponent} from "../new-leasson/new-leasson.component";

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
    MatExpansionPanelDescription
  ],
  templateUrl: './all-lessons.component.html',
  styleUrl: './all-lessons.component.scss'
})
export class AllLessonsComponent implements OnInit{
  panelOpenState = false;
  courseTitle:any;

  constructor(private dialog:MatDialog,
              @Inject(MAT_DIALOG_DATA) private data:any
              ) {
  }
  createLesson() {
    this.dialog.closeAll();
    this.dialog.open(NewLeassonComponent,{
      data:{
        id:this.data.id
      }
    });
  }

  ngOnInit(): void {
    this.courseTitle= this.data.title;
  }
}
