import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {CheckboxItem} from './CheckboxItem';
import {MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements AfterViewInit {
  @ViewChild('panel') panel: MatExpansionPanel;
  @Input() groupName: string;
  @Output() toggle = new EventEmitter<string[]>();
  items: CheckboxItem[];

  @Input('inputItems')
  set inputItems(inputItems: CheckboxItem[]) {
    if (this.items === undefined) {
      this.items = inputItems;
    }
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].checked = inputItems[i].checked;
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
