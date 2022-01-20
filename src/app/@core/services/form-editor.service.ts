import { Injectable } from '@angular/core';
import { DataValueDto, FieldType, IDataFieldDto, IFormPostPutCommon, LocalizedStringDto } from '@core/api';

@Injectable({
  providedIn: 'root'
})
export class FormEditorService {
  _fieldModels: Array<IDataFieldDto> = [];

  _model: IFormPostPutCommon = {};
  constructor() {
    const dataValues = new DataValueDto({
      value: new LocalizedStringDto({
        ar: 'اختيار',
        en: 'Option'
      })
    })

    this._model = {
      name: new LocalizedStringDto({
        ar: '',
        en: ''
      }),
      description: new LocalizedStringDto({
        ar: '',
        en: ''
      }),
      realStateId: null,
      type: null,
      fields: [],
    };

    this._fieldModels = [
      {
        name: new LocalizedStringDto({
          ar: 'نص',
          en: 'Text'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Text,
        code: 'A',
        placeHolder: new LocalizedStringDto({
          ar: 'نص',
          en: 'Text'
        }),
        regex: '',
      },
      {
        name: new LocalizedStringDto({
          ar: 'رقم',
          en: 'Number'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Number,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: 'ناتج',
          en: 'Result'
        }),
        orders: null,
        isRequired: false,
        equation: null,
        fieldType: FieldType.Result,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: 'تاريخ',
          en: 'Date'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Date,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: ' تاريخ ووقت',
          en: 'Date & Time'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.DateTime,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: ' فقرة',
          en: 'Textarea'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.TextArea,
        code: 'A',
        placeHolder: new LocalizedStringDto({
          ar: 'نص',
          en: 'Text'
        }),
        regex: '',
      },
      {
        name: new LocalizedStringDto({
          ar: ' صورة',
          en: 'Image'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Image,
        code: 'A',
      },
      {
        name: new LocalizedStringDto({
          ar: ' ملف',
          en: 'Pdf'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Pdf,
        code: 'A',
      },
      {
        name: new LocalizedStringDto({
          ar: 'خانة اختيار ',
          en: 'CheckBox'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.CheckBox,
        code: 'A',
        dataValues: [dataValues, dataValues]
      },
      {
        name: new LocalizedStringDto({
          ar: 'زر اختيارات',
          en: 'Radio Button'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Radio,
        code: 'A',
        dataValues: [dataValues, dataValues]
      },
      {
        name: new LocalizedStringDto({
          ar: 'قائمة منسدلة',
          en: 'Dropdown Menu'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Select,
        code: 'A',
        dataValues: [dataValues, dataValues]
      }
    ];
  }
}
