import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalizedStringDto, PlansClient, PlansPostCommand, PlansPutCommand, PlanVmForDashborad } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';

@Component({
  selector: 'app-plans-create-update',
  templateUrl: './plans-create-update.component.html',
})
export class PlansCreateUpdateComponent implements OnInit {


  form: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlanVmForDashborad,
    public _PlansClient: PlansClient,
    private _dialogRef: MatDialogRef<PlansCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder,
  ) { }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {} as PlanVmForDashborad;

      this.form = this._fb.group({
        name: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
        reportsNumber: [''],
        price: [''],
        usersNumber: [''],
      });
    } else {
      this.form = this._fb.group({
        name: this._fb.group({
          Ar: [this.data.name.ar || '', Validators.required],
          En: [this.data.name.en || '', Validators.required],
        }),
        reportsNumber: [this.data.reportsNumber,''],
        price: [this.data.price,''],
        usersNumber: [this.data.usersNumber,''],
      });
    }
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  post(value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const reportsNumber = value.reportsNumber;

    const price = value.price;

    const usersNumber = value.usersNumber;

    return new PlansPostCommand({
      name,
      reportsNumber,
      price,
      usersNumber,
    });
  }

  put(id: any, value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const reportsNumber = value.reportsNumber;

    const price = value.price;

    const usersNumber = value.usersNumber;

    return new PlansPutCommand({
      id,
      name,
      reportsNumber,
      price,
      usersNumber,
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
      this.data.reportsNumber = value.reportsNumber;
      this.data.price = value.price;
      this.data.usersNumber = value.usersNumber;

      this._dialogRef.close();

      this._handler.handleSuccess();
    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }


}

