import { TestBed } from '@angular/core/testing';

import { ContractFile } from './contract-file';

describe('ContractFile', () => {
  let service: ContractFile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractFile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
