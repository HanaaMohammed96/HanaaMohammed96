export interface SelectionAction {
  label: string;
  ref: any;
  onInitActionName?: string;
  actionName: string;
  icon: any;
  disabled: boolean;
  loading: boolean;
  cssClasses?: string[];
}
