import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard';
import { PartnerListComponent } from './partners/components/partner-list/partner-list';
import { PartnerFormComponent } from './partners/components/partner-form/partner-form';
import { PartnerContractListComponent } from './contracts/components/partner-contract-list/partner-contract-list';
import { ContractFormComponent } from './contracts/components/contract-form/contract-form';
import { ContractFileListComponent } from './contracts/components/contract-file-list/contract-file-list';
import { ContractListComponent } from './contracts/components/contract-list/contract-list';

export const routes: Routes = [
  // Publikus bejelentkezési oldal.
  {
    path: 'login',
    component: LoginComponent
  },

  // Védett alkalmazásrész.
  // Minden belső oldal a közös layout alatt jelenik meg.
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Irányítópult.
      // Ez az alap belépési oldal sikeres login után.
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      // Partner lista.
      {
        path: 'partners',
        component: PartnerListComponent
      },

      // Új partner létrehozása.
      {
        path: 'partners/new',
        component: PartnerFormComponent
      },

      // Partner szerkesztése.
      {
        path: 'partners/:id/edit',
        component: PartnerFormComponent
      },

      // Globális szerződéslista.
      // Erre fognak mutatni a dashboard kártyák és a későbbi szűrések.
      {
        path: 'contracts',
        component: ContractListComponent
      },

      // Az adott partnerhez tartozó szerződések listája.
      {
        path: 'partners/:id/contracts',
        component: PartnerContractListComponent
      },

      // Új szerződés létrehozása az adott partnerhez.
      {
        path: 'partners/:id/contracts/new',
        component: ContractFormComponent
      },

      // Az adott szerződéshez tartozó dokumentumok listája.
      {
        path: 'contracts/:id/files',
        component: ContractFileListComponent
      },

      // Ha a belső gyökérútvonalra érkezünk,
      // automatikusan az Irányítópultra dobunk.
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Minden ismeretlen route az Irányítópultra menjen.
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
