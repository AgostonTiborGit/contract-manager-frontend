import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeletePartner } from './confirm-delete-partner';

describe('ConfirmDeletePartner', () => {
  let component: ConfirmDeletePartner;
  let fixture: ComponentFixture<ConfirmDeletePartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeletePartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeletePartner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
