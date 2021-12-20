import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export class FilterControl {
  name: string;
  control: FormControl;
  valueProperty: string;
  nameProperty: string;
  list$: Observable<any[]>;
}
