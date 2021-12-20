import { FilterControl } from '@core/interfaces/filter-control.interface';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
})
export class FilterDialogComponent implements OnDestroy {
  icClose = icClose;

  closed = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FilterControl[],
    private _dialogRef: MatDialogRef<FilterDialogComponent>
  ) {}

  ngOnDestroy(): void {
    this._dialogRef.close({ closed: this.closed });
  }

  onFilter(): void {
    this.closed = false;

    this._dialogRef.close();
  }
}
