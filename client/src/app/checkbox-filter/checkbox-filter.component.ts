import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { CheckboxItem } from './CheckboxItem';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements AfterViewInit, OnChanges {
  @ViewChild('panel') panel: MatExpansionPanel;
  @Input() groupName: string;
  @Input() inputItems: CheckboxItem[];
  @Output() toggle = new EventEmitter<string[]>();
  items: CheckboxItem[];

  constructor(
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputItems) {
      if (this.items === undefined) {
        this.items = changes.inputItems.currentValue;
      }
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].checked = changes.inputItems.currentValue[i].checked;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.items) {
      if (this.hasChecked()) {
        this.panel.open();
      }
      this.cd.detectChanges();
    }
  }

  onToggle() {
    this.toggle.emit(this.items.filter(item => item.checked).map(item => item.value));
  }

  clearSelection() {
    for (const item of this.items) {
      item.checked = false;
    }
    this.onToggle();
  }

  hasChecked(): boolean {
    return this.items.find(item => item.checked) !== undefined;
  }
}
