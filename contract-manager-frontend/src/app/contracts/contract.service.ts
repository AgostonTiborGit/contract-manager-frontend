import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract, CreateContractRequest } from './contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private http = inject(HttpClient);

  /* ================= GLOBAL CONTRACT ENDPOINT ================= */

  // Később a navbaros globális szerződéslista is ezt fogja használni.
  private baseUrl = '/api/contracts';

  /* ================= QUERY: ALL CONTRACTS ================= */

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl);
  }

  /* ================= QUERY: SINGLE CONTRACT ================= */

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/${id}`);
  }

  /* ================= QUERY: CONTRACTS OF A PARTNER ================= */

  // Partnerhez tartozó szerződések lekérdezése.
  getByPartnerId(partnerId: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`/api/partners/${partnerId}/contracts`);
  }

  /* ================= COMMAND: CREATE CONTRACT ================= */

  // Új szerződés létrehozása.
  create(request: CreateContractRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }
}
