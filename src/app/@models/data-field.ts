export interface DataField {
  _id?:any;
  name?:any;
  type?:any;
  icon?:any;
  required?:any;
  regex?:any;
  errorText?:any;
  label?:any;
  description?:any;
  placeholder?:any;
  subtype?:any;
  handle?:any;
  min?:number;
  max?:number;
  inline?:any;
  value?:any;
  values?:Array<value>;
}
export interface value {
  label?:any,
  value?:any
}

