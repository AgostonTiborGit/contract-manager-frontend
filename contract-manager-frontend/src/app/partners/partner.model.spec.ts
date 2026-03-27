import { TestBed } from '@angular/core/testing';

import { PartnerModel } from './partner.model';

describe('PartnerModel', () => {
  let service: PartnerModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
