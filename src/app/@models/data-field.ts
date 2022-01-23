import { DataFieldDto, LocalizedStringDto, RequestType } from '@core/api';

export interface IFormPostPut {
  id?: number;
  name?: LocalizedStringDto;
  description?: LocalizedStringDto;
  realStateId?: number;
  type?: RequestType;
  regionId?: number;
  fields?: DataFieldDto[];
}


