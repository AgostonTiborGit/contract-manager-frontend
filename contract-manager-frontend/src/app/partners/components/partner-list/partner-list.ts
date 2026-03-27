import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerService, PartnerWithStats } from '../../partner.service';
import { ConfirmDeletePartnerComponent } from '../confirm-delete-partner/confirm-delete-partner';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDeletePartnerComponent
  ],
  templateUrl: './partner-list.html',
  styleUrls: ['./partner-list.css']
})
export class PartnerListComponent implements OnInit {

  private partnerService = inject(PartnerService);

  partners: PartnerWithStats[] = [];
  loading = false;
  error?: string;

  deletingPartner?: PartnerWithStats;
  deleteLoading = false;
  deleteError?: string;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.partnerService.getAllWithStats().subscribe({
      next: (partners: PartnerWithStats[]) => {
        this.partners = partners;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Partner lista betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  openDelete(partner: PartnerWithStats): void {
    this.deletingPartner = partner;
    this.deleteError = undefined;
  }

  cancelDelete(): void {
    this.deletingPartner = undefined;
    this.deleteError = undefined;
  }

  confirmDelete(): void {
    if (!this.deletingPartner) {
      return;
    }

    this.deleteLoading = true;
    this.deleteError = undefined;

    this.partnerService.delete(this.deletingPartner.id).subscribe({
      next: () => {
        this.deletingPartner = undefined;
        this.deleteLoading = false;
        this.load();
      },
      error: (err: any) => {
        this.deleteError = err?.error?.message ?? 'Partner törlése sikertelen';
        this.deleteLoading = false;
      }
    });
  }

  trackById(_: number, partner: PartnerWithStats): number {
    return partner.id;
  }
}
