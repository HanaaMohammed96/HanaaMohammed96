import { DataFieldDto, LocalizedStringDto, RequestType } from '@core/api';

export interface IFormPostPut {
  id?: number;
  name?: LocalizedStringDto | undefined;
  description?: LocalizedStringDto | undefined;
  realStateId?: number;
  type?: RequestType;
  fields?: DataFieldDto[] | undefined;
}


