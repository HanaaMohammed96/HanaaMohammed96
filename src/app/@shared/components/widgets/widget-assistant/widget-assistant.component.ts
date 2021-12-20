import { Component, OnInit } from '@angular/core';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';

@Component({
  selector: 'app-widget-assistant',
  templateUrl: './widget-assistant.component.html',
})
export class WidgetAssistantComponent implements OnInit {
  icCheckCircle = icCheckCircle;

  constructor() {}

  ngOnInit() {}
}
