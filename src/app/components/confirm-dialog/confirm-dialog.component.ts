import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationVo } from './confirm-vo';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmationVo) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.data.answer = true;
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.data.answer = false;
    this.dialogRef.close(this.data);
  }
}
