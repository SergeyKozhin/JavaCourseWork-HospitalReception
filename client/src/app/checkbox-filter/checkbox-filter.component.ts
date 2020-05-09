import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CheckboxItem } from './CheckboxItem';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements AfterViewInit {
  @ViewChild('panel') panel: MatExpansionPanel;
  @Input() groupName: string;
  @Output() toggle = new EventEmitter<string[]>();
  _items: CheckboxItem[];
  get items() {
    return this._items;
  }

  @Input('items')
  set inputItems(items: CheckboxItem[]) {
    if (JSON.stringify(this._items) !== JSON.stringify(items)) {
      if (this._items === undefined) {
        this._items = items;
      }
      for (let i = 0; i < this._items.length; i++) {
        this._items[i].checked = items[i].checked;
      }
    }
  }

  constructor(
    private cd: ChangeDetectorRef
  ) { }

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
