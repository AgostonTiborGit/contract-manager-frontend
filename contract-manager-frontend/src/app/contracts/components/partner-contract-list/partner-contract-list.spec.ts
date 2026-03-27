import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContractList } from './partner-contract-list';

describe('PartnerContractList', () => {
  let component: PartnerContractList;
  let fixture: ComponentFixture<PartnerContractList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerContractList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerContractList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
