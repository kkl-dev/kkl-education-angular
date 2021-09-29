
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog'
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  messageToReturn: string;
  invalid: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog) { }
  ngOnInit(): void {
    this.dialogRef.updateSize('500px')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick() {

    if (this.data.isWithFillField != true)
      this.dialogRef.close(1);
    else {
      if (this.messageToReturn != " ")
        this.dialogRef.close(this.messageToReturn)
      else
        this.invalid = true

    }
  }
}
