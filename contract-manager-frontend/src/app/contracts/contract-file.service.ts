import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContractFile } from './contract-file.model';

@Injectable({
  providedIn: 'root'
})
export class ContractFileService {

  private http = inject(HttpClient);
  private baseUrl = '/api/contracts';

  /* ================= QUERY: FILES OF CONTRACT ================= */

  // Egy szerződéshez tartozó feltöltött fájlok lekérdezése.
  getByContractId(contractId: number): Observable<ContractFile[]> {
    return this.http.get<ContractFile[]>(`${this.baseUrl}/${contractId}/files`);
  }

  /* ================= COMMAND: UPLOAD FILE ================= */

  // PDF feltöltése multipart/form-data formában.
  upload(
    contractId: number,
    file: File,
    displayName?: string,
    primaryFile?: boolean
  ): Observable<ContractFile> {
    const formData = new FormData();
    formData.append('file', file);

    if (displayName && displayName.trim().length > 0) {
      formData.append('displayName', displayName.trim());
    }

    if (primaryFile !== undefined) {
      formData.append('primaryFile', String(primaryFile));
    }

    return this.http.post<ContractFile>(`${this.baseUrl}/${contractId}/files`, formData);
  }

  /* ================= DOWNLOAD URL ================= */

  // Letöltéshez / új tabos megnyitáshoz kész URL.
  getDownloadUrl(fileId: number): string {
    return `${this.baseUrl}/files/${fileId}/download`;
  }
}
