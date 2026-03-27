import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

export interface AuthUser {
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly AUTH_HEADER_KEY = 'authHeader';
  private readonly ME_URL = '/api/auth/me';

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const token = btoa(`${email}:${password}`);
    const authHeader = `Basic ${token}`;

    const headers = new HttpHeaders({
      Authorization: authHeader
    });

    return this.http.get<AuthUser>(this.ME_URL, { headers }).pipe(
      tap(user => {
        sessionStorage.setItem(this.AUTH_HEADER_KEY, authHeader);
        this.userSubject.next(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.AUTH_HEADER_KEY);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.AUTH_HEADER_KEY);
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ROLE_ADMIN';
  }

  loadMe(): Observable<AuthUser | null> {
    return this.http.get<AuthUser>(this.ME_URL).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  getAuthHeader(): string | null {
    return sessionStorage.getItem(this.AUTH_HEADER_KEY);
  }
}
