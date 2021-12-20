export class TableColumn<T> {
  label: string;
  property: string;
  navigation?: (item: T) => any;
  type: 'checkbox' | 'image' | 'text' | 'date' | 'datetime' | 'boolean'  | 'badge' | 'url'| 'progress' | 'button' | 'view';
  converter?: (value: any) => string;
  visible?: boolean;
  cssClasses?: string[];
  ngCssClasses?: (item: T) => string[];
}
