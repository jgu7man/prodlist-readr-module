import { TestBed } from '@angular/core/testing';

import { ReadrApiService } from './readr-api.service';

describe('ReadrApiService', () => {
  let service: ReadrApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadrApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
