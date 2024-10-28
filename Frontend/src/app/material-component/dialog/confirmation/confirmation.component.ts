import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  [x: string]: any;
  onEmitStatusChange = new EventEmitter();
  details: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public dialog: any) {}

  ngOnInit(): void {
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }
  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }
}
