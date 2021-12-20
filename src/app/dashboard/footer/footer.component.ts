import { Component, Input, TemplateRef } from '@angular/core';
import icDownload from '@iconify/icons-ic/baseline-cloud-download';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() customTemplate: TemplateRef<any>;

  icDownload = icDownload;
}
