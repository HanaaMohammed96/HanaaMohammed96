import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../dashboard/country/country.component';
import { LocalizedStringDto } from './api';

export class CountryDto implements ICountryDto {
  id?: number;
  name?: LocalizedStringDto | undefined;
  isActive?: boolean;

  constructor(data?: ICountryDto) {
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
          this.name = _data["name"] ? LocalizedStringDto.fromJS(_data["name"]) : <any>undefined;
          this.isActive = _data["isActive"];
      }
  }

  static fromJS(data: any): CountryDto {
      data = typeof data === 'object' ? data : {};
      let result = new CountryDto();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name ? this.name.toJSON() : <any>undefined;
      data["isActive"] = this.isActive;
      return data;
  }
}

export interface ICountryDto {
  id?: number;
  name?: LocalizedStringDto | undefined;
  isActive?: boolean;
}

export class CountryVmForDashboard implements CountryVmForDashboard {
  id?: number;
  name?: LocalizedStringDto | undefined;
  isActive?: boolean;

  constructor(data?: ICountryVmForDashboard) {
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
          this.name = _data["name"] ? LocalizedStringDto.fromJS(_data["name"]) : <any>undefined;
          this.isActive = _data["isActive"];
      }
  }

  static fromJS(data: any): CountryVmForDashboard {
      data = typeof data === 'object' ? data : {};
      let result = new CountryVmForDashboard();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name ? this.name.toJSON() : <any>undefined;
      data["isActive"] = this.isActive;
      return data;
  }
}

export interface ICountryVmForDashboard {
  id?: number;
  name?: LocalizedStringDto | undefined;
  isActive?: boolean;
}

export class CountryVm implements ICountryVm {
  id?: number;
  name?: string | undefined;

  constructor(data?: ICountryVm) {
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

  static fromJS(data: any): CountryVm {
      data = typeof data === 'object' ? data : {};
      let result = new CountryVm();
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

export interface ICountryVm {
  id?: number;
  name?: string | undefined;
}

// export class CountryPostPutCommon implements ICountryPostPutCommon {
//   name?: LocalizedStringDto | undefined;
//   isActive?: boolean;

//   constructor(data?: ICountryPostPutCommon) {
//       if (data) {
//           for (var property in data) {
//               if (data.hasOwnProperty(property))
//                   (<any>this)[property] = (<any>data)[property];
//           }
//       }
//   }

//   init(_data?: any) {
//       if (_data) {
//           this.name = _data["name"] ? LocalizedStringDto.fromJS(_data["name"]) : <any>undefined;
//           this.isActive = _data["isActive"];
//       }
//   }

//   static fromJS(data: any): CountryPostPutCommon {
//       data = typeof data === 'object' ? data : {};
//       let result = new CountryPostPutCommon();
//       result.init(data);
//       return result;
//   }

//   toJSON(data?: any) {
//       data = typeof data === 'object' ? data : {};
//       data["name"] = this.name ? this.name.toJSON() : <any>undefined;
//       data["isActive"] = this.isActive;
//       return data;
//   }
// }

// export interface IRealStatePostPutCommon {
//   name?: LocalizedStringDto | undefined;
//   isActive?: boolean;
// }

// export class RealStatesPostCommand extends RealStatePostPutCommon implements IRealStatesPostCommand {

//   constructor(data?: IRealStatesPostCommand) {
//       super(data);
//   }

//   init(_data?: any) {
//       super.init(_data);
//   }

//   static fromJS(data: any): RealStatesPostCommand {
//       data = typeof data === 'object' ? data : {};
//       let result = new RealStatesPostCommand();
//       result.init(data);
//       return result;
//   }

//   toJSON(data?: any) {
//       data = typeof data === 'object' ? data : {};
//       super.toJSON(data);
//       return data;
//   }
// }

// export interface IRealStatesPostCommand extends IRealStatePostPutCommon {
// }

// export class RealStatesPutCommand extends RealStatePostPutCommon implements IRealStatesPutCommand {
//   id?: number;

//   constructor(data?: IRealStatesPutCommand) {
//       super(data);
//   }

//   init(_data?: any) {
//       super.init(_data);
//       if (_data) {
//           this.id = _data["id"];
//       }
//   }

//   static fromJS(data: any): RealStatesPutCommand {
//       data = typeof data === 'object' ? data : {};
//       let result = new RealStatesPutCommand();
//       result.init(data);
//       return result;
//   }

//   toJSON(data?: any) {
//       data = typeof data === 'object' ? data : {};
//       data["id"] = this.id;
//       super.toJSON(data);
//       return data;
//   }
// }

// export interface IRealStatesPutCommand extends IRealStatePostPutCommon {
//   id?: number;
// }

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {

  private list: Country[]=[];
constructor(private httpSer:HttpClient) { }


getAll():Observable<Country[]>
{
 return this.httpSer.get<Country[]>(`${environment.apiUrl}/Countries/GetPage`);
}
}
