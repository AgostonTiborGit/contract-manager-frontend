import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../../contract.service';
import { Contract } from '../../contract.model';
import { ContractFileService } from '../../contract-file.service';
import { ContractFile } from '../../contract-file.model';

@Component({
  selector: 'app-contract-file-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './contract-file-list.html'
})
export class ContractFileListComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private contractService = inject(ContractService);
  private contractFileService = inject(ContractFileService);

  contractId!: number;

  contract?: Contract;
  files: ContractFile[] = [];

  loading = false;
  uploading = false;
  error?: string;
  uploadError?: string;

  selectedFile?: File;
  displayName = '';
  primaryFile = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error = 'Hiányzó szerződés azonosító';
      return;
    }

    this.contractId = Number(idParam);

    if (Number.isNaN(this.contractId)) {
      this.error = 'Érvénytelen szerződés azonosító';
      return;
    }

    this.loadPage();
  }

  /* ================= LOAD PAGE ================= */

  // Először betöltjük a szerződés metaadatait, aztán a fájlokat.
  private loadPage(): void {
    this.loading = true;
    this.error = undefined;

    this.contractService.getById(this.contractId).subscribe({
      next: (contract: Contract) => {
        this.contract = contract;
        this.loadFiles();
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Szerződés adatainak betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  private loadFiles(): void {
    this.contractFileService.getByContractId(this.contractId).subscribe({
      next: (files: ContractFile[]) => {
        this.files = files;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Fájllista betöltése sikertelen';
        this.loading = false;
      }
    });
  }

  /* ================= FILE INPUT ================= */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.uploadError = undefined;

    if (!file) {
      this.selectedFile = undefined;
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.selectedFile = undefined;
      this.uploadError = 'Csak PDF fájl tölthető fel';
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  /* ================= UPLOAD ================= */

  upload(): void {
    if (!this.selectedFile || this.uploading) {
      return;
    }

    this.uploading = true;
    this.uploadError = undefined;

    this.contractFileService.upload(
      this.contractId,
      this.selectedFile,
      this.displayName,
      this.primaryFile
    ).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFile = undefined;
        this.displayName = '';
        this.primaryFile = false;
        this.loadFiles();
      },
      error: (err: any) => {
        this.uploadError = err?.error?.message ?? 'Fájl feltöltése sikertelen';
        this.uploading = false;
      }
    });
  }

  /* ================= HELPERS ================= */

  getDownloadUrl(file: ContractFile): string {
    return this.contractFileService.getDownloadUrl(file.id);
  }

  getReadableSize(fileSize: number): string {
    if (fileSize < 1024) {
      return `${fileSize} B`;
    }

    if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(1)} KB`;
    }

    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  }

  getDisplayName(file: ContractFile): string {
    return file.displayName || file.originalFileName;
  }

  trackById(_: number, file: ContractFile): number {
    return file.id;
  }
}
