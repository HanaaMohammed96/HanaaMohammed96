import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { DataField, value } from '@models/data-field';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss']
})
export class TestFormComponent implements OnInit {
  @ViewChild(MatSidenav)
  
  sidenav!: MatSidenav;
  events: string[] = [];
  opened: boolean;

  value:value={
    label:"",
    value:""
  };
  fieldModels:Array<DataField>=[
    {
      "type": "text",
      "label": "Text",
      "icon":"text_format",
      "description": "Enter your name",
      "placeholder": "Enter your name",
      "subtype": "text",
      "regex" : "",
      "handle":true
    },
    {
      "type": "date",
      "icon":"today",
      "label": "Date",
      "placeholder": "Date",
    },
    {
      "type": "datetime-local",
      "icon":"today",
      "label": "DateTime",
      "placeholder": "Date Time",
    },
    {
      "type": "textarea",
      "icon":"text_fields",
      "label": "Textarea" 
    },
    {
      "type": "paragraph",
      "icon":"vertical_distribute",
      "label": "Paragraph",
      "placeholder": "Type your text to display here only" 
    },
    {
      "type": "checkbox",
      "icon":"fact_check",
      "required": true,
      "label": "Checkbox",
      "description": "Checkbox",
      "inline": true,
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "radio",
      "icon":"radio_button_checked",
      "label": "Radio",
      "description": "Radio boxes",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "autocomplete",
      "icon": "menu",
      "label": "Select",
      "description": "Select",
      "placeholder": "Select",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        },
        {
          "label": "Option 3",
          "value": "option-3"
        }
      ]
    },
    {
      "type": "file",
      "icon": "upload_file",
      "label": "File Upload",
      "subtype": "file"
    }
  ];
  modelFields:Array<DataField>=[];
  model:any = {
    name:'Form Name',
    description:'From Description...',
    attributes:this.modelFields
  };
  secondList:Array<DataField>=[]
  report = false;
  reports:any = [];
  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  constructor(
    private observer: BreakpointObserver,
    public dialog:MatDialog
    ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }
  drop(event: CdkDragDrop<string[]>) {
    // console.log(event)
    // console.log(event.isPointerOverContainer)
    // console.log(event.item.dropped)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
      // let idx=event.container.data.indexOf(event.previousContainer.data[event.previousIndex]);
      // if(idx != -1){
      //   return;//if item exist
      // }
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    if(!event.isPointerOverContainer){
      event.container.data.splice(event.previousIndex, 1)
    }
  }
  addValue(values){
    values.push(this.value);
    this.value={label:"",value:""};
  }
  removeField(i){    
    console.log(this.secondList)
    this.model.attributes.splice(i,1);
    this.secondList.splice(i,1);
  }
  initReport(){
    this.report = true; 
    let input = {
      id:this.model._id
    }
  }
  onFileChanged(event) {
    const file = event.target.files[0]
    console.log(file)
  }
  openDialog(templateRef: TemplateRef<any>){
this.dialog.open(templateRef);
  }
}
