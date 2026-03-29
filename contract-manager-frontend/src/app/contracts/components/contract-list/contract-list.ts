import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractService } from '../../contract.service';
import { Contract } from '../../contract.model';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './contract-list.html',
  styleUrls: ['./contract-list.css']
})
export class ContractListComponent implements OnInit {

  private contractService = inject(ContractService);
  private route = inject(ActivatedRoute);

  // Backendről betöltött szerződések.
  contracts: Contract[] = [];

  // Állapotkezelés.
  loading = false;
  error?: string;

  // URL-ből érkező szűrők.
  // Ezeket most még frontend oldalon alkalmazzuk,
  // de a végleges üzleti logikát később backendre visszük.
  statusFilter?: string;
  expiringWithinDays?: number;

  ngOnInit(): void {
    this.readQueryParams();
    this.loadContracts();
  }

  // Query paramok beolvasása.
  // Példák:
  // /contracts?status=expired
  // /contracts?status=active
  // /contracts?expiringWithinDays=30
  private readQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;

    this.statusFilter = params.get('status') ?? undefined;

    const expiringWithinDaysParam = params.get('expiringWithinDays');
    this.expiringWithinDays = expiringWithinDaysParam
      ? Number(expiringWithinDaysParam)
      : undefined;
  }

  // Szerződések betöltése a backendről.
  // Jelenleg minden szerződést lekérünk, és frontend oldalon szűrünk.
  // Ez átmeneti megoldás, amíg nincs backend oldali szűrhető lista endpoint.
  private loadContracts(): void {
    this.loading = true;
    this.error = undefined;

    this.contractService.getAll().subscribe({
      next: (contracts: Contract[]) => {
        this.contracts = contracts;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'A szerződések betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  // A megjelenítendő, szűrt lista.
  get filteredContracts(): Contract[] {
    return this.contracts.filter((contract: Contract) => {
      // Lejárt szűrés.
      if (this.statusFilter === 'expired' && !this.isExpired(contract)) {
        return false;
      }

      // Aktív szűrés.
      if (this.statusFilter === 'active' && !this.isActive(contract)) {
        return false;
      }

      // Hamar lejáró szűrés.
      if (
        this.expiringWithinDays !== undefined &&
        !this.isExpiringWithinDays(contract, this.expiringWithinDays)
      ) {
        return false;
      }

      return true;
    });
  }

  // Segéd: lejárt-e a szerződés.
  // Csak határozott idejű szerződés lehet lejárt.
  isExpired(contract: Contract): boolean {
    if (!contract.fixedTerm || !contract.endDate) {
      return false;
    }

    const today = this.getTodayAsString();
    return contract.endDate < today;
  }

  // Segéd: aktív-e a szerződés.
  // Egyszerű átmeneti megjelenítési logika:
  // - ha még nem indult el, nem aktív
  // - ha határozott és lejárt, nem aktív
  // - egyébként aktív
  isActive(contract: Contract): boolean {
    const today = this.getTodayAsString();

    if (contract.startDate > today) {
      return false;
    }

    if (contract.fixedTerm && contract.endDate && contract.endDate < today) {
      return false;
    }

    return true;
  }

  // Segéd: X napon belül lejár-e.
  // Csak határozott idejű, végdátummal rendelkező szerződésre értelmezhető.
  isExpiringWithinDays(contract: Contract, days: number): boolean {
    if (!contract.fixedTerm || !contract.endDate) {
      return false;
    }

    const today = new Date();
    const endDate = new Date(contract.endDate);

    if (Number.isNaN(endDate.getTime())) {
      return false;
    }

    const diffInMs = endDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays >= 0 && diffInDays <= days;
  }

  // Megjelenítési státusz címke.
  // Ez most UI-segédlogika, nem végleges üzleti szabályrendszer.
  getStatusLabel(contract: Contract): string {
    const today = this.getTodayAsString();

    if (this.isExpired(contract)) {
      return 'Lejárt';
    }

    if (contract.startDate > today) {
      return 'Jövőbeli';
    }

    if (!contract.fixedTerm) {
      return 'Határozatlan';
    }

    return 'Aktív';
  }

  // Megjelenítési státusz CSS osztály.
  getStatusClass(contract: Contract): string {
    const today = this.getTodayAsString();

    if (this.isExpired(contract)) {
      return 'status-expired';
    }

    if (contract.startDate > today) {
      return 'status-upcoming';
    }

    if (!contract.fixedTerm) {
      return 'status-indefinite';
    }

    return 'status-active';
  }

  // Partner neve biztonságosan.
  getPartnerName(contract: Contract): string {
    return contract.partner?.name ?? '-';
  }

  // Referenciaszám megjelenítése.
  getReferenceNumber(contract: Contract): string {
    return contract.referenceNumber?.trim() ? contract.referenceNumber : '-';
  }

  // Mai dátum YYYY-MM-DD formátumban.
  private getTodayAsString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  // trackBy optimalizálás.
  trackById(_: number, contract: Contract): number {
    return contract.id;
  }
}
