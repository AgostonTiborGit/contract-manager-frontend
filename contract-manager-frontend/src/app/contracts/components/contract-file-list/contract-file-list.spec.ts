import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractFileList } from './contract-file-list';

describe('ContractFileList', () => {
  let component: ContractFileList;
  let fixture: ComponentFixture<ContractFileList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractFileList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractFileList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
