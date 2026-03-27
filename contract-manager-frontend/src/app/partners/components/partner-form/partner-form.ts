import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from '../../partner.service';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-form.html',
  styleUrls: ['./partner-form.css']
})
export class PartnerFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  lookupLoading = false;
  error?: string;

  isEditMode = false;
  partnerId?: number;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    taxNumber: ['', [Validators.required, Validators.pattern(/^\d{8}|\d{11}$/)]],
    address: [''],
    email: [''],
    phone: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.partnerId = Number(idParam);
      this.loadPartner(this.partnerId);
    }
  }

  private loadPartner(id: number): void {
    this.loading = true;
    this.error = undefined;

    this.partnerService.getById(id).subscribe({
      next: partner => {
        this.form.patchValue({
          name: partner.name ?? '',
          taxNumber: partner.taxNumber ?? '',
          address: partner.address ?? '',
          email: partner.email ?? '',
          phone: partner.phone ?? ''
        });
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message ?? 'Partner betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  lookup(): void {
    if (this.form.controls.taxNumber.invalid || this.lookupLoading) {
      return;
    }

    this.lookupLoading = true;
    this.error = undefined;

    const taxNumber = this.form.controls.taxNumber.value;

    this.partnerService.lookup(taxNumber).subscribe({
      next: result => {
        this.form.patchValue({
          name: result.name,
          address: result.address
        });
        this.lookupLoading = false;
      },
      error: err => {
        this.error = err?.error?.message ?? 'Cégadat nem található';
        this.lookupLoading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.error = undefined;

    const payload = this.form.getRawValue();

    if (this.isEditMode && this.partnerId) {
      this.partnerService.update(this.partnerId, payload).subscribe({
        next: () => {
          this.router.navigate(['/partners']);
        },
        error: err => {
          this.error = err?.error?.message ?? 'Partner módosítása sikertelen';
          this.loading = false;
        }
      });
      return;
    }

    this.partnerService.create(payload).subscribe({
      next: () => {
        this.router.navigate(['/partners']);
      },
      error: err => {
        this.error = err?.error?.message ?? 'Partner létrehozása sikertelen';
        this.loading = false;
      }
    });
  }
}
