import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partner } from './partner.model';

export interface PartnerWithStats extends Partner {
  activeContracts: number;
  expiredContracts: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private http = inject(HttpClient);
  private baseUrl = '/api/partners';

  /* ---------- QUERY ---------- */

  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.baseUrl);
  }

  getAllWithStats(): Observable<PartnerWithStats[]> {
    return this.http.get<PartnerWithStats[]>(`${this.baseUrl}/with-stats`);
  }

  getById(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.baseUrl}/${id}`);
  }

  /* ---------- COMMAND ---------- */

  create(partner: Omit<Partner, 'id'>): Observable<Partner> {
    return this.http.post<Partner>(this.baseUrl, partner);
  }

  update(id: number, partner: Omit<Partner, 'id'>): Observable<Partner> {
    return this.http.put<Partner>(`${this.baseUrl}/${id}`, partner);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /* ---------- EXTERNAL ---------- */

  lookup(taxNumber: string): Observable<{ name: string; address: string; taxNumber: string }> {
    return this.http.get<{ name: string; address: string; taxNumber: string }>(
      `${this.baseUrl}/lookup/${taxNumber}`
    );
  }
}
