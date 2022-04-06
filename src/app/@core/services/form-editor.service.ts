import { Injectable } from '@angular/core';
import { DataValueDto, FieldType, IDataFieldDto, LocalizedStringDto } from '@core/api';
import { IFormPostPut } from '@models/data-field';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormEditorService {
  lang: string;

  _fieldModels: Array<IDataFieldDto> = [];

  _model: IFormPostPut = {};

  countryId: number;
  subRegionId: number;
  regionId: number;
  type: number;

  private validateForm = new BehaviorSubject<boolean>(false);
  _validateForm = this.validateForm.asObservable();

  constructor() {
    this.lang = localStorage.getItem('lang') as string;

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
        placeholder: new LocalizedStringDto({
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
        placeholder: new LocalizedStringDto({
          ar: 'نص',
          en: 'Text'
        }),
        orders: null,
        isRequired: false,
        equation: null,
        fieldType: FieldType.Result,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: 'حقل مخفي',
          en: 'Hidden'
        }),
        orders: null,
        isRequired: false,
        equation: null,
        fieldType: FieldType.Hidden,
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
        placeholder: new LocalizedStringDto({
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
        fieldType: FieldType.SingleImage,
        code: 'A',
      },
      {
        name: new LocalizedStringDto({
          ar: ' صور',
          en: 'Images'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.MultiImages,
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
        dataValues: [dataValues]
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
        dataValues: [dataValues]
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
        dataValues: [dataValues]
      },
      {
        name: new LocalizedStringDto({
          ar: 'قائمة منسدلة متعددة الاختيارت',
          en: 'Dropdown menu with multi select'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.MultiSelect,
        code: 'A',
        dataValues: [dataValues]
      }
    ];
  }

  toLang(name: LocalizedStringDto) {
    if (name) {
      if (this.lang == 'en') {
        return name.en;
      }
      return name.ar;
    } else {
      return " "
    }
  }

  validForm(form) {
    if (form.name.ar != '' &&
      form.name.en != '' &&
      form.description.ar != '' &&
      form.description.en != '' &&
      form.realStateId != null &&
      form.type != null && form.regionId != null && form.fields.length != 0) {
      // return true;
      return this.validateForm.next(true)
    } else {
      // return false;
      return this.validateForm.next(false)

    }
  }

  myIcon(type): string {
    switch (type) {
      case 'Text':
        return 'format_color_text';
        break;
      case 'Number':
        return 'filter_7';
        break;
      case 'Date':
        return 'date_range';
        break;
      case 'DateTime':
        return 'event';
        break;
      case 'TextArea':
        return 'format_indent_increase';
        break;
      case 'CheckBox':
        return 'checklist';
        break;
      case 'Radio':
        return 'radio_button_checked';
        break;
      case 'Select':
        return 'menu';
        break;
      case 'MultiSelect':
        return 'keyboard_double_arrow_down';
        break;
      case 'SingleImage':
        return 'insert_photo';
        break;
      case 'MultiImages':
        return 'collections';
        break;
      case 'Pdf':
        return 'picture_as_pdf';
        break;
      case 'Hidden':
        return 'visibility_off';
        break;
      default:
        return 'text_fields';
    }

  }

}
