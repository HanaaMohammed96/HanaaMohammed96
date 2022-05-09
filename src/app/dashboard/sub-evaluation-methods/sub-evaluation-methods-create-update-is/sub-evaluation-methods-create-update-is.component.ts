import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RealStateDto, RealStatesClient, LocalizedStringDto, RealStatesPostCommand, RealStatesPutCommand } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { RealStateCreateUpdateComponent } from '../../real-states/real-state-create-update/real-state-create-update.component';

@Component({
  selector: 'app-sub-evaluation-methods-create-update-is',
  templateUrl: './sub-evaluation-methods-create-update-is.component.html',
  styleUrls: ['./sub-evaluation-methods-create-update-is.component.scss']
})
export class SubEvaluationMethodsCreateUpdateIsComponent implements OnInit {

  form: FormGroup;

  isActive  = {isActive : false};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RealStateDto,
    public realStateClient: RealStatesClient,
    private _dialogRef: MatDialogRef<SubEvaluationMethodsCreateUpdateIsComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder
  ) { }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit() {
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
      this.isActive =  {isActive : this.data.isActive};
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

      this._dialogRef.close();
      
      this._handler.handleSuccess();

    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
      
    );
  }

}
