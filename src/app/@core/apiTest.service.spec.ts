/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiTestService } from './apiTest.service';

describe('Service: ApiTest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiTestService]
    });
  });

  it('should ...', inject([ApiTestService], (service: ApiTestService) => {
    expect(service).toBeTruthy();
  }));
});
