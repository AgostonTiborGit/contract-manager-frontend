import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-delete-partner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirm-delete-partner.html',
  styleUrls: ['./confirm-delete-partner.css']
})
export class ConfirmDeletePartnerComponent {

  private fb = inject(FormBuilder);

  @Input() open = false;

  @Input() partnerName = '';
  @Input() partnerTaxNumber = '';

  @Input() activeContracts = 0;
  @Input() expiredContracts = 0;

  @Input() loading = false;
  @Input() error?: string;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  form = this.fb.nonNullable.group({
    confirmText: ['', [Validators.required, Validators.pattern(/^IGEN$/)]]
  });

  close(): void {
    this.form.reset();
    this.cancel.emit();
  }

  doConfirm(): void {
    if (this.form.invalid || this.loading) {
      return;
    }
    this.confirm.emit();
  }
}
