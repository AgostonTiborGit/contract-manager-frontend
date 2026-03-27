import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { PartnerListComponent } from './partners/components/partner-list/partner-list';
import { PartnerFormComponent } from './partners/components/partner-form/partner-form';
import { PartnerContractListComponent } from './contracts/components/partner-contract-list/partner-contract-list';
import { ContractFormComponent } from './contracts/components/contract-form/contract-form';
import { ContractFileListComponent } from './contracts/components/contract-file-list/contract-file-list';

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

      // Új szerződés létrehozása az adott partnerhez.
      { path: 'partners/:id/contracts/new', component: ContractFormComponent },

      // Szerződéshez tartozó dokumentumok.
      { path: 'contracts/:id/files', component: ContractFileListComponent },

      { path: '', redirectTo: 'partners', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'partners' }
];
