import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxItem } from './CheckboxItem';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {
  @Input() groupName: string;
  @Input() items: CheckboxItem[];
  @Output() toggle = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onToggle() {
    this.toggle.emit(this.items.filter(item => item.checked).map(item => item.value));
  }
}
