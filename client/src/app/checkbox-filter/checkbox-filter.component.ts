import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @Input() items: CheckboxItem[];
  @Output() toggle = new EventEmitter<string[]>();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (this.items.find(item => item.checked)) {
      this.panel.open();
    }
    this.cd.detectChanges();
  }

  onToggle() {
    this.toggle.emit(this.items.filter(item => item.checked).map(item => item.value));
  }
}
