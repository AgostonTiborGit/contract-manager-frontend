import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractService } from '../../contract.service';
import { Contract } from '../../contract.model';
import { PartnerService } from '../../../partners/partner.service';
import { Partner } from '../../../partners/partner.model';

@Component({
  selector: 'app-partner-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './partner-contract-list.html'
})
export class PartnerContractListComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private contractService = inject(ContractService);
  private partnerService = inject(PartnerService);

  partnerId!: number;

  partner?: Partner;
  contracts: Contract[] = [];

  loading = false;
  error?: string;

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

    this.loadPartnerAndContracts();
  }

  /* ================= LOAD PAGE DATA ================= */

  // Betöltjük a partner adatait és a hozzá tartozó szerződéseket.
  private loadPartnerAndContracts(): void {
    this.loading = true;
    this.error = undefined;

    this.partnerService.getById(this.partnerId).subscribe({
      next: (partner: Partner) => {
        this.partner = partner;
        this.loadContracts();
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Partner adatainak betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  /* ================= LOAD CONTRACTS ================= */

  private loadContracts(): void {
    this.contractService.getByPartnerId(this.partnerId).subscribe({
      next: (contracts: Contract[]) => {
        this.contracts = contracts;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Szerződéslista betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  /* ================= HELPERS ================= */

  // Emberi olvasható címke az enum értékből.
  getContractTypeLabel(type: string): string {
    switch (type) {
      case 'SERVICE_AGREEMENT':
        return 'Szolgáltatási szerződés';
      case 'SALES_CONTRACT':
        return 'Adásvételi szerződés';
      case 'NDA':
        return 'Titoktartási szerződés';
      case 'LEASE_AGREEMENT':
        return 'Bérleti szerződés';
      case 'FRAMEWORK_AGREEMENT':
        return 'Keretszerződés';
      case 'OTHER':
        return 'Egyéb';
      default:
        return type;
    }
  }

  // Soronkénti státusz meghatározása a megjelenítéshez.
  getStatus(contract: Contract): 'ACTIVE' | 'EXPIRED' | 'INDEFINITE' | 'UPCOMING' {
    const today = this.getTodayAsString();

    if (!contract.fixedTerm) {
      return 'INDEFINITE';
    }

    if (contract.endDate && contract.endDate < today) {
      return 'EXPIRED';
    }

    if (contract.startDate > today) {
      return 'UPCOMING';
    }

    return 'ACTIVE';
  }

  getStatusLabel(contract: Contract): string {
    const status = this.getStatus(contract);

    switch (status) {
      case 'ACTIVE':
        return 'Aktív';
      case 'EXPIRED':
        return 'Lejárt';
      case 'INDEFINITE':
        return 'Határozatlan';
      case 'UPCOMING':
        return 'Jövőbeli';
    }
  }

  getStatusClass(contract: Contract): string {
    const status = this.getStatus(contract);

    switch (status) {
      case 'ACTIVE':
        return 'bg-success';
      case 'EXPIRED':
        return 'bg-danger';
      case 'INDEFINITE':
        return 'bg-primary';
      case 'UPCOMING':
        return 'bg-warning text-dark';
    }
  }

  formatAmount(contract: Contract): string {
    if (contract.amount == null || !contract.currency) {
      return '-';
    }

    return `${contract.amount} ${contract.currency}`;
  }

  private getTodayAsString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  trackById(_: number, contract: Contract): number {
    return contract.id;
  }
}
