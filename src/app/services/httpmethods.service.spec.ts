import { TestBed } from '@angular/core/testing';

import { HttpmethodsService } from './httpmethods.service';

describe('HttpmethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpmethodsService = TestBed.get(HttpmethodsService);
    expect(service).toBeTruthy();
  });
});
