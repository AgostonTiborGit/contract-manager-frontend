import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Egyszerű dashboard kártya modell.
// Később ezt backendből érkező adatokra cseréljük.
interface DashboardStatCard {
  title: string;
  value: string;
  description: string;
  route: string;
  queryParams?: Record<string, string | number | boolean>;
}

// Figyelmet igénylő listaelem modell.
interface DashboardAttentionItem {
  partnerName: string;
  contractTitle: string;
  dueDate: string;
  status: string;
  hasDocument: boolean;
}

// Dokumentumhiányos listaelem modell.
interface DashboardMissingDocumentItem {
  partnerName: string;
  contractTitle: string;
  createdAt: string;
  documentCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  // Felső stat kártyák.
  // Most még mintaadatokkal dolgozunk.
  // Később ezeket backend összesítő endpoint fogja adni.
  statCards: DashboardStatCard[] = [
    {
      title: 'Partnerek',
      value: '24',
      description: 'Összes nyilvántartott partner',
      route: '/partners'
    },
    {
      title: 'Összes szerződés',
      value: '58',
      description: 'Minden rögzített szerződés',
      route: '/contracts'
    },
    {
      title: 'Aktív szerződések',
      value: '33',
      description: 'Jelenleg érvényes szerződések',
      route: '/contracts',
      queryParams: { status: 'active' }
    },
    {
      title: 'Lejárt szerződések',
      value: '9',
      description: 'Azonnali átnézést igényelhet',
      route: '/contracts',
      queryParams: { status: 'expired' }
    },
    {
      title: '30 napon belül lejárók',
      value: '6',
      description: 'Közelgő lejáratok',
      route: '/contracts',
      queryParams: { expiringWithinDays: 30 }
    },
    {
      title: 'Dokumentum nélküli szerződések',
      value: '4',
      description: 'Hiányzó feltöltött dokumentum',
      route: '/contracts',
      queryParams: { missingDocuments: true }
    }
  ];

  // Figyelmet igénylő szerződések minta lista.
  // Később ezt is backend adja.
  attentionItems: DashboardAttentionItem[] = [
    {
      partnerName: 'Alfa Kft.',
      contractTitle: 'Szolgáltatási keretszerződés',
      dueDate: '2026-04-05',
      status: 'Hamar lejár',
      hasDocument: true
    },
    {
      partnerName: 'Béta Zrt.',
      contractTitle: 'Licencszerződés',
      dueDate: '2026-03-10',
      status: 'Lejárt',
      hasDocument: false
    },
    {
      partnerName: 'Gamma Bt.',
      contractTitle: 'Karbantartási szerződés',
      dueDate: '2026-04-18',
      status: 'Hamar lejár',
      hasDocument: true
    }
  ];

  // Dokumentumhiányos szerződések minta lista.
  missingDocumentItems: DashboardMissingDocumentItem[] = [
    {
      partnerName: 'Delta Kft.',
      contractTitle: 'Bérleti szerződés',
      createdAt: '2026-02-14',
      documentCount: 0
    },
    {
      partnerName: 'Epszilon Kft.',
      contractTitle: 'Titoktartási megállapodás',
      createdAt: '2026-03-02',
      documentCount: 0
    }
  ];

  // Egységes badge szöveg a dokumentum állapothoz.
  getDocumentLabel(hasDocument: boolean): string {
    return hasDocument ? 'Van' : 'Nincs';
  }

  // Egységes CSS osztály a dokumentum állapothoz.
  getDocumentClass(hasDocument: boolean): string {
    return hasDocument ? 'status-ok' : 'status-missing';
  }
}
