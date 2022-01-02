import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { DataField, value } from '@models/data-field';
import { TranslateService } from '@ngx-translate/core';
import {cloneDeep} from 'lodash'; 
// import swal from 'sweetalert';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  currentItem:DataField
  value:value={
    label:"",
    value:""
  };


  fieldModels:Array<DataField>=[
    {
      "type": "text",
      "label": this.translateService.instant('formFields.text'),
      "icon":"text_format",
      "placeholder": "enter your text",
      "required": false,
      "regex" : "",
    },
    {
      "type": "date",
      "icon":"today",
      "label": this.translateService.instant('formFields.date'),
      "placeholder": "Date",
    },
    {
      "type": "datetime-local",
      "icon":"today",
      "label": this.translateService.instant('formFields.dateTime'),
      "placeholder": "Date Time",
    },
    {
      "type": "textarea",
      "icon":"text_fields",
      "label": this.translateService.instant('formFields.textarea'),
      "placeholder": "enter description" 
    },
    {
      "type": "checkbox",
      "icon":"fact_check",
      "required": false,
      "label": this.translateService.instant('formFields.checkBox'),
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        }
      ]
    },
    {
      "type": "radio",
      "icon":"radio_button_checked",
      "label": this.translateService.instant('formFields.radio'),
      "required": false,
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        }
      ]
    },
    {
      "type": "autocomplete",
      "icon": "menu",
      "label": this.translateService.instant('formFields.select'),
      "placeholder": "Select",
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        },
        {
          "label": this.translateService.instant('formFields.Option3'),
          "value": "option-3"
        }
      ]
    },
    {
      "type": "file",
      "icon": "upload_file",
      "label": this.translateService.instant('formFields.fileUpload'),
      "subtype": "file"
    }
  ];


  modelFields:Array<DataField>=[];
  model:any = {
    name:this.translateService.instant('model.name'),
    description:this.translateService.instant('model.description'),
    attributes:this.modelFields
  };

  secondList:Array<DataField>=[];
  thirdList:Array<DataField>=[]

  report = false;
  reports:any = [];

  constructor(
    public dialog:MatDialog,
    private translateService: TranslateService,
    private formDetailesModel:ChangeFormDetailsService
  ) { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    // console.log(event.isPointerOverContainer)
    // console.log(event.item.dropped)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex); 
      // return;
    } else {
      // Clone the item that was dropped.
    const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);

    // Add the clone to the new array.
    event.container.data.splice(event.currentIndex, 0, clone);
    }
    if(!event.isPointerOverContainer){
      event.container.data.splice(event.previousIndex, 1)
    }
    this.model.attributes = [...event.container.data ] 
    this.thirdList = Array.from(this.model.attributes)

  }

  addValue(values){
    if(!values){
      values = []
    }
    values.push(this.value);
    this.value={label:"",value:""};
  }
  

  removeField(i){
    console.log("this.secondList",this.secondList)
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
    .afterClosed().subscribe(data=>{
      if(data){
        this.secondList.splice(i,1);
        console.log("this.secondList2= ",this.secondList)
          this.model.attributes.splice(i,1);
        }else{
          return;
        }
      })    
  }
  

  initReport(){
    console.log(this.model)
    this.report = true; 
    this.reports = this.model.attributes
    let input = {
      id:this.model._id
    }
  }


  onFileChanged(event) {
    const file = event.target.files[0]
  }
  openDialog(templateRef: TemplateRef<any>, item){
    this.currentItem = {...item}
    let dialogRef = this.dialog.open(templateRef,{
      data: item
    })
    dialogRef.afterClosed().subscribe((result => {
      
    }))
  }

  formDetails(){
    this.formDetailesModel.openDialog().subscribe(data =>{      
      if(data){
        this.model.name = data.name
        this.model.description = data.description
      }else{
        return;
      }
    });
  }
}
