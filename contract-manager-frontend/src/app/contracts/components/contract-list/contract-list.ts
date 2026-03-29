import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../contract.service';
import { Contract } from '../../contract.model';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contract-list.html',
  styleUrls: ['./contract-list.css']
})
export class ContractListComponent implements OnInit {

  private contractService = inject(ContractService);
  private route = inject(ActivatedRoute);

  contracts: Contract[] = [];

  loading = false;
  error?: string;

  // szűrési állapot
  statusFilter?: string;
  missingDocuments = false;
  expiringWithinDays?: number;

  ngOnInit(): void {
    this.readQueryParams();
    this.load();
  }

  // query paramok olvasása (dashboard miatt)
  private readQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;

    this.statusFilter = params.get('status') || undefined;
    this.missingDocuments = params.get('missingDocuments') === 'true';

    const days = params.get('expiringWithinDays');
    this.expiringWithinDays = days ? Number(days) : undefined;
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.contractService.getAll().subscribe({
      next: (contracts: Contract[]) => {
        this.contracts = contracts;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Szerződések betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  // ===== FILTER LOGIKA (frontend v1) =====
  get filteredContracts(): Contract[] {
    return this.contracts.filter(c => {

      // státusz filter (egyszerűsített)
      if (this.statusFilter === 'expired' && !this.isExpired(c)) {
        return false;
      }

      if (this.statusFilter === 'active' && this.isExpired(c)) {
        return false;
      }

      // dokumentum hiány
      if (this.missingDocuments && (c.documents?.length ?? 0) > 0) {
        return false;
      }

      return true;
    });
  }

  // ===== SEGÉD =====
  isExpired(contract: Contract): boolean {
    if (!contract.endDate) return false;

    const today = new Date().toISOString().slice(0, 10);
    return contract.endDate < today;
  }
}
