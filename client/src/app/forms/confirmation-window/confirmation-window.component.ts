import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-window',
  templateUrl: './confirmation-window.component.html',
  styleUrls: ['./confirmation-window.component.css']
})
export class ConfirmationWindowComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }
}
