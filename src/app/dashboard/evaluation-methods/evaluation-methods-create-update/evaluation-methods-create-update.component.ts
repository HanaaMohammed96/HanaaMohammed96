import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegionDto, RegionsClient, LocalizedStringDto, RegionsPostCommand, RegionsPutCommand } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-evaluation-methods-create-update',
  templateUrl: './evaluation-methods-create-update.component.html',
})
export class EvaluationMethodsCreateUpdateComponent implements OnInit {

  form: FormGroup;

countryId:number
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegionDto,
    public _RegionsClient: RegionsClient,
    private _dialogRef: MatDialogRef<EvaluationMethodsCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder,
  ) {
  }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {} as RegionDto;

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


    const parentRegionId = null;

    return new RegionsPostCommand({
      name,
      isActive,
      parentRegionId,
    });
  }

  put(id: any, value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const isActive = value.isActive;


    const parentRegionId = null;

    return new RegionsPutCommand({
      id,
      name,
      isActive,
      parentRegionId,
    });
  }

  submit(event: any) {
    const value = event.value;

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    event.action.pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response) {
        this.data.id = response.result;
      }

      this.data.name = name;
      this.data.isActive = value.isActive;
      this.data.countryId = value.countryId;

      this._dialogRef.close();

      this._handler.handleSuccess();
    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }

  activate(event: boolean) {
    this.data.isActive = event;
  }
  onSelect(event :any) {
    this.data.countryId =event ;
  }

}
