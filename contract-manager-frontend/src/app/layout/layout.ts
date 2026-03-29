import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

// A navbarban jelenleg ezek a lenyíló menük vannak.
// Az Irányítópult már nem dropdown, ezért nincs benne.
type NavbarMenu = 'lists' | 'actions' | 'admin' | 'user' | null;

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {

  // Éppen megnyitott navbar menü.
  openMenu: NavbarMenu = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Kijelentkezés után bezárjuk a menüket,
  // majd visszadobjuk a felhasználót a login oldalra.
  logout(): void {
    this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  // Admin szerepkör ellenőrzése az Admin menü megjelenítéséhez.
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Lenyíló menü nyitása / zárása.
  // Ha ugyanarra kattintunk újra, bezárjuk.
  toggleMenu(menu: NavbarMenu, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  // Minden menü bezárása.
  closeMenus(): void {
    this.openMenu = null;
  }

  // Menüelemről navigáció után is zárjuk a nyitott dropdownokat.
  onMenuAction(): void {
    this.closeMenus();
  }

  // Felhasználói avatar kezdőbetű.
  getUserInitial(email: string | null | undefined): string {
    if (!email || email.trim().length === 0) {
      return 'U';
    }

    return email.trim().charAt(0).toUpperCase();
  }

  // Ha a felhasználó a dokumentum más részére kattint,
  // zárjuk be a lenyíló menüket.
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenus();
  }
}
