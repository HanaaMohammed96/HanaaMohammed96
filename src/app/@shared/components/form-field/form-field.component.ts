import { AbstractControl } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  @Input() title: string;
  @Input() control: AbstractControl;

  get name(): string | null {
    const formGroup = this.control.parent.controls;
    return (
      Object.keys(formGroup).find((name) => this.control === formGroup[name]) || null
    );
  }
}
