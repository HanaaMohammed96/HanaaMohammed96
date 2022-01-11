import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRealStatesClient, LocalizedStringDto, RealStateDto, RealStatesClient, RealStatesPostCommand, RealStatesPutCommand } from '@core/api';

@Component({
  selector: 'app-real-state-create-update',
  templateUrl: './real-state-create-update.component.html',
})
export class RealStateCreateUpdateComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RealStateDto,
    public realStateClient: RealStatesClient,
    private _dialogRef: MatDialogRef<RealStateCreateUpdateComponent>,
    private _fb: FormBuilder
  ) { }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit() {

    console.log(this.data)
    if (!this.data) {
      this.data = {} as RealStateDto;

      this.form = this._fb.group({
        name: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
        isActive: [''],
      });
    } else {
      this.form = this._fb.group({
        name: this._fb.group({
          Ar: [this.data.name.ar || '', Validators.required],
          En: [this.data.name.en || '', Validators.required],
        }),
        isActive: [''],
      });
    }
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  post(value: any): any {
    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });
    const isActive = value.isActive;

    return new RealStatesPostCommand({
      name,
      isActive
    });
  }

  put(id: any, value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });
    const isActive = value.isActive;

    return new RealStatesPutCommand({
      id,
      name,
      isActive
    });
  }

  submit(event: any) {
    const value = event.value;

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    event.action.subscribe((response: any) => {
      if (response) {
        this.data.id = response.result;
      }

      this.data.name = name;
      this.data.isActive = value.isActive;

        alert(this.data.isActive)
      this._dialogRef.close();
    });
  }

  activate(event: boolean) {
    this.data.isActive = event;
  }

}
