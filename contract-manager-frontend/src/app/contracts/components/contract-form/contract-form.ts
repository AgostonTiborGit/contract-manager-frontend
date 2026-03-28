import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractService } from '../../contract.service';
import { ContractType, CreateContractRequest, Currency } from '../../contract.model';
import { PartnerService } from '../../../partners/partner.service';
import { Partner } from '../../../partners/partner.model';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './contract-form.html'
})
export class ContractFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);
  private partnerService = inject(PartnerService);

  partnerId!: number;
  partner?: Partner;

  loading = false;
  saving = false;
  error?: string;

  contractTypes: { value: ContractType; label: string }[] = [
    { value: 'SERVICE_AGREEMENT', label: 'Szolgáltatási szerződés' },
    { value: 'SALES_CONTRACT', label: 'Adásvételi szerződés' },
    { value: 'NDA', label: 'Titoktartási szerződés' },
    { value: 'LEASE_AGREEMENT', label: 'Bérleti szerződés' },
    { value: 'FRAMEWORK_AGREEMENT', label: 'Keretszerződés' },
    { value: 'OTHER', label: 'Egyéb' }
  ];

  currencies: { value: Currency; label: string }[] = [
    { value: 'HUF', label: 'HUF' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' }
  ];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    referenceNumber: ['', [Validators.maxLength(255)]],
    contractType: ['OTHER' as ContractType, Validators.required],
    fixedTerm: [true, Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    noticePeriodDays: [''],
    notes: ['', [Validators.maxLength(2000)]],
    amount: [''],
    currency: ['' as Currency | '']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error = 'Hiányzó partner azonosító';
      return;
    }

    this.partnerId = Number(idParam);

    if (Number.isNaN(this.partnerId)) {
      this.error = 'Érvénytelen partner azonosító';
      return;
    }

    this.loadPartner();
    this.setupFixedTermHandling();
  }

  private loadPartner(): void {
    this.loading = true;
    this.error = undefined;

    this.partnerService.getById(this.partnerId).subscribe({
      next: (partner: Partner) => {
        this.partner = partner;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Partner adatainak betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  private setupFixedTermHandling(): void {
    this.form.controls.fixedTerm.valueChanges.subscribe((fixedTerm: any) => {
      const isFixed = fixedTerm === true || fixedTerm === 'true';
      const endDateControl = this.form.controls.endDate;

      if (isFixed) {
        endDateControl.enable({ emitEvent: false });
      } else {
        endDateControl.setValue('', { emitEvent: false });
        endDateControl.disable({ emitEvent: false });
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.saving || !this.partnerId) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request = this.buildRequest(raw);

    if (!request) {
      return;
    }

    this.saving = true;
    this.error = undefined;

    this.contractService.create(request).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/partners', this.partnerId, 'contracts']);
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Szerződés mentése sikertelen';
        this.saving = false;
      }
    });
  }

  private buildRequest(raw: any): CreateContractRequest | null {
    const title = raw.title?.trim();
    const referenceNumber = this.normalizeString(raw.referenceNumber);
    const notes = this.normalizeString(raw.notes);

    const fixedTerm = raw.fixedTerm === true || raw.fixedTerm === 'true';
    const startDate = raw.startDate;
    const endDate = raw.endDate || undefined;

    const noticePeriodDays = this.parseOptionalInteger(raw.noticePeriodDays);
    const amount = this.parseOptionalNumber(raw.amount);
    const currency = raw.currency || undefined;

    if (!title) {
      this.error = 'A cím megadása kötelező';
      return null;
    }

    if (!fixedTerm && endDate) {
      this.error = 'Határozatlan szerződésnél nem lehet végdátum';
      return null;
    }

    if (fixedTerm && !endDate) {
      this.error = 'Határozott szerződésnél a végdátum kötelező';
      return null;
    }

    if ((amount == null && currency) || (amount != null && !currency)) {
      this.error = 'Az összeg és a pénznem együtt adható meg';
      return null;
    }

    return {
      title,
      referenceNumber,
      contractType: raw.contractType,
      fixedTerm,
      startDate,
      endDate,
      noticePeriodDays,
      notes,
      amount,
      currency,
      partnerId: this.partnerId
    };
  }

  private normalizeString(value: string | null | undefined): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private parseOptionalInteger(value: any): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private parseOptionalNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
