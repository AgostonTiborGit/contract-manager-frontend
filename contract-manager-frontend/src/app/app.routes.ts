import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { PartnerListComponent } from './partners/components/partner-list/partner-list';
import { PartnerFormComponent } from './partners/components/partner-form/partner-form';
import { PartnerContractListComponent } from './contracts/components/partner-contract-list/partner-contract-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'partners', component: PartnerListComponent },
      { path: 'partners/new', component: PartnerFormComponent },
      { path: 'partners/:id/edit', component: PartnerFormComponent },

      /* ================= PARTNER CONTRACTS ================= */

      // Partnerhez tartozó szerződéslista oldal.
      { path: 'partners/:id/contracts', component: PartnerContractListComponent },

      { path: '', redirectTo: 'partners', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'partners' }
];
