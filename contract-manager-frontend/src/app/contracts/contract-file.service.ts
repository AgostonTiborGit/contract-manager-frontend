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

  getByContractId(contractId: number): Observable<ContractFile[]> {
    return this.http.get<ContractFile[]>(`${this.baseUrl}/${contractId}/files`);
  }

  upload(contractId: number, file: File): Observable<ContractFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ContractFile>(`${this.baseUrl}/${contractId}/files`, formData);
  }

  download(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/${fileId}/download`, {
      responseType: 'blob'
    });
  }
}
