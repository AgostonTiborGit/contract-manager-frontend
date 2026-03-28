import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

type NavbarMenu = 'dashboard' | 'lists' | 'actions' | 'admin' | 'user' | null;

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

  openMenu: NavbarMenu = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  toggleMenu(menu: NavbarMenu, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  closeMenus(): void {
    this.openMenu = null;
  }

  onMenuAction(): void {
    this.closeMenus();
  }

  getUserInitial(email: string | null | undefined): string {
    if (!email || email.trim().length === 0) {
      return 'U';
    }

    return email.trim().charAt(0).toUpperCase();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenus();
  }
}
