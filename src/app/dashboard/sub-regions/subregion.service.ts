import { Injectable } from '@angular/core';
import { RegionDto } from '@core/api';

@Injectable({
  providedIn: 'root'
})
export class SubregionService {

  constructor(
    private parentRegion: RegionDto
  ) { }
  get _parentRegion(): RegionDto {
    return this.parentRegion;
  }
  set _parentRegion(_data) {
    this.parentRegion = _data;
  }
}
