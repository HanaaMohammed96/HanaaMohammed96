import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { CommonQuestion, CommonQuestionPostCommand, CommonQuestionPutCommand, CommonQuestionsClient, LocalizedStringDto } from './../../../@core/api';

@Component({
  selector: 'app-commonQuestionsCreateUpdate',
  templateUrl: './commonQuestionsCreateUpdate.component.html',
})
export class CommonQuestionsCreateUpdateComponent implements OnInit {
  form: FormGroup;

  isActive  = {isActive : false};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommonQuestion,
    public _commonQuestionClient: CommonQuestionsClient,
    private _dialogRef: MatDialogRef<CommonQuestionsCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder
  ) { }

  get questionAr(): AbstractControl {
    return this.form.get('question.Ar');
  }

  get questionEn(): AbstractControl {
    return this.form.get('question.En');
  }
  get answerAr(): AbstractControl {
    return this.form.get('answer.Ar');
  }

  get answerEn(): AbstractControl {
    return this.form.get('answer.En');
  }

  ngOnInit() {
    if (!this.data) {
      this.data = {} as CommonQuestion;
      
      this.form = this._fb.group({
        question: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
        answer: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
      });
    } else {
      this.form = this._fb.group({
        question: this._fb.group({
          Ar: [this.data.question.ar || '', Validators.required],
          En: [this.data.question.en || '', Validators.required],
        }),
        answer: this._fb.group({
          Ar: [this.data.answer.ar || '', Validators.required],
          En: [this.data.answer.en || '', Validators.required],
        }),
      });
    }
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  post(value: any): any {
    const question = new LocalizedStringDto({ ar: value.question.Ar, en: value.question.En });
    const answer = new LocalizedStringDto({ ar: value.answer.Ar, en: value.answer.En });

    return new CommonQuestionPostCommand({
      question,
      answer
    });
  }

  put(id: any, value: any): any {

    const question = new LocalizedStringDto({ ar: value.question.Ar, en: value.question.En });
    const answer = new LocalizedStringDto({ ar: value.answer.Ar, en: value.answer.En });

    return new CommonQuestionPutCommand({
      id,
      question,
      answer
    });
  }

  submit(event: any) {
    const value = event.value;

    const question = new LocalizedStringDto({ ar: value.question.Ar, en: value.question.En });
    const answer = new LocalizedStringDto({ ar: value.answer.Ar, en: value.answer.En });

    event.action.subscribe((response: any) => {
      if (response) {
        this.data.id = response.result;
      }

      this.data.question = question;
      this.data.answer = answer;

      this._dialogRef.close();
      
      this._handler.handleSuccess();

    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }

}
