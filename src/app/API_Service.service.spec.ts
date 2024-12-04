/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { API_ServiceService } from './API_Service.service';

describe('Service: API_Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [API_ServiceService]
    });
  });

  it('should ...', inject([API_ServiceService], (service: API_ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
