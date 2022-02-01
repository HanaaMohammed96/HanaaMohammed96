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
        messageNumber: [''],
        emailNumber: [''],
        adminNumber: [''],
        incpectorNumber: [''],
        evaluatorNumber: [''],
        auditorNumber: [''],
        commissionerNumber:[''],
        reportsSentNumber:['']
      });
    } else {
      this.form = this._fb.group({
        name: this._fb.group({
          Ar: [this.data.name.ar || '', Validators.required],
          En: [this.data.name.en || '', Validators.required],
        }),
        messageNumber: [this.data.messageNumber,''],
        emailNumber: [this.data.emailNumber,''],
        adminNumber: [this.data.adminNumber,''],
        incpectorNumber: [this.data.inspectorNumber,''],
        evaluatorNumber: [this.data.evaluatorNumber,''],
        auditorNumber: [this.data.auditorNumber,''],
        commissionerNumber:[this.data.commissionerNumber,''],
        reportsSentNumber:[this.data.reportsSentNumber,'']
      });
    }
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  post(value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const messageNumber = value.messageNumber;

    const emailNumber = value.emailNumber;

    const adminNumber = value.adminNumber;

    const  inspectorNumber = value.inspectorNumber;

    const  evaluatorNumber = value.evaluatorNumber;

    const  auditorNumber = value.auditorNumber;

    const  commissionerNumber = value.commissionerNumber;

    const  reportsSentNumber = value.reportsSentNumber;

    return new PlansPostCommand({
      name,
      messageNumber,
      emailNumber,
      adminNumber,
      inspectorNumber,
      evaluatorNumber,
      auditorNumber,
      commissionerNumber,
      reportsSentNumber
    });
  }

  put(id: any, value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const messageNumber = value.messageNumber;

    const emailNumber = value.emailNumber;

    const adminNumber = value.adminNumber;

    const  inspectorNumber = value.inspectorNumber;

    const  evaluatorNumber = value.evaluatorNumber;

    const  auditorNumber = value.auditorNumber;

    const  commissionerNumber = value.commissionerNumber;

    const  reportsSentNumber = value.reportsSentNumber;

    return new PlansPutCommand({
      id,
      name,
      messageNumber,
      emailNumber,
      adminNumber,
      inspectorNumber,
      evaluatorNumber,
      auditorNumber,
      commissionerNumber,
      reportsSentNumber
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
      this.data.messageNumber = value.messageNumber;
      this.data.emailNumber = value.emailNumber;
      this.data.adminNumber = value.adminNumber;
      this.data.inspectorNumber = value.inspectorNumber;
      this.data.evaluatorNumber = value.evaluatorNumber;
      this.data.auditorNumber = value.auditorNumber;
      this.data.commissionerNumber = value.commissionerNumber;
      this.data.reportsSentNumber = value.reportsSentNumber;

      this._dialogRef.close();

      this._handler.handleSuccess();
    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }


}

