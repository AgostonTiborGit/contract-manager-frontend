import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerService } from '../../partner.service';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-form.html',
  styleUrls: ['./partner-form.css']
})
export class PartnerFormComponent {

  private fb = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private router = inject(Router);

  loading = false;
  lookupLoading = false;
  error?: string;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    taxNumber: ['', [Validators.required, Validators.pattern(/^\d{8}|\d{11}$/)]],
    address: [''],
    email: [''],
    phone: ['']
  });

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
        this.error = err.error?.message ?? 'Cégadat nem található';
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

    this.partnerService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/partners']);
      },
      error: err => {
        this.error = err.error?.message ?? 'Partner létrehozása sikertelen';
        this.loading = false;
      }
    });
  }
}
