import { finalize, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import { ApiHandlerService } from '@core/services/api-handler.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent {
  @Input() id: any;
  @Input() title: string;
  @Input() formGroup: FormGroup;
  @Input() client: any;
  @Input() post: (value: any) => any;
  @Input() put: (id: any, value: any) => any;

  // Optional
  @Input() custom = false;
  @Input() createBtn: string;
  @Input() loading = false;
  @Input() errors = { detail: null, key: null };

  @Output() fgSubmit = new EventEmitter();
  @Output() request = new EventEmitter<any>();

  icClose = icClose;

  constructor(private _handler: ApiHandlerService) {}

  onSubmit(): void {
    if (this.fgSubmit.observers.length > 0) {
      this.fgSubmit.next();
      return;
    }

    const value = this.formGroup.getRawValue();

    if (!value) {
      return;
    }

    this.loading = true;

    let action: Observable<any> = !this.id
      ? this.client.post(this.post(value))
      : this.client.put(this.put(this.id, value));

    action = action.pipe(
      finalize(() => (this.loading = false)),
      catchError((err) => {
        this._handler
          .handleError(err)
          .assignValidationErrors(this.formGroup)
          .assignErrors(this.errors);

        return throwError(err);
      })
    );

    this.request.next({ value, action });
  }
}
