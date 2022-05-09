import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationMethodsService {

  constructor() { }
}
export interface IEvaluationMethodsVmForDashboard {
  id?: number;
  name?: string | undefined;
  subEvaluationMethods?: EvaluationMethodsVm[] | undefined;
}
export class EvaluationMethodsVmForDashboard implements IEvaluationMethodsVmForDashboard {
  id?: number;
  name?: string | undefined;
  subEvaluationMethods?: EvaluationMethodsVm[] | undefined;

  constructor(data?: IEvaluationMethodsVmForDashboard) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.id = _data["id"];
          this.name = _data["name"];
          if (Array.isArray(_data["subEvaluationMethods"])) {
              this.subEvaluationMethods = [] as any;
              for (let item of _data["subEvaluationMethods"])
                  this.subEvaluationMethods!.push(EvaluationMethodsVm.fromJS(item));
          }
      }
  }

  static fromJS(data: any): EvaluationMethodsVmForDashboard {
      data = typeof data === 'object' ? data : {};
      let result = new EvaluationMethodsVmForDashboard();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      if (Array.isArray(this.subEvaluationMethods)) {
          data["subEvaluationMethods"] = [];
          for (let item of this.subEvaluationMethods)
              data["subEvaluationMethods"].push(item.toJSON());
      }
      return data;
  }
}

export class EvaluationMethodsVm implements IEvaluationMethodsVm {
  id?: number;
  name?: string | undefined;

  constructor(data?: IEvaluationMethodsVm) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.id = _data["id"];
          this.name = _data["name"];
      }
  }

  static fromJS(data: any): EvaluationMethodsVm {
      data = typeof data === 'object' ? data : {};
      let result = new EvaluationMethodsVm();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      return data;
  }
}

export interface IEvaluationMethodsVm {
  id?: number;
  name?: string | undefined;
}


