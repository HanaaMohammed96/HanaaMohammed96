import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template:`
    <div class="p-6 flex flex-col justify-center items-center content-center">
      <mat-icon (click)="closeDialog()" style="transform: scale(2);color:#F44336">new_releases</mat-icon>
      <div class="w-full p-6 ">{{data.message}}</div>
    </div>
    <div class=" flex flex-row justify-evenly">
    <button mat-raised-button [mat-dialog-close]="false" color="warn">No</button>
    <button mat-raised-button [mat-dialog-close]="true" color="primary">Yes</button>
    </div>
  `
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
}
