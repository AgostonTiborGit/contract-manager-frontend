export type ContractType =
  | 'SERVICE_AGREEMENT'
  | 'SALES_CONTRACT'
  | 'NDA'
  | 'LEASE_AGREEMENT'
  | 'FRAMEWORK_AGREEMENT'
  | 'OTHER';

export type Currency =
  | 'HUF'
  | 'EUR'
  | 'USD';

export interface ContractPartner {
  id: number;
  name: string;
  taxNumber: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface Contract {
  id: number;
  title: string;
  referenceNumber?: string;
  contractType: ContractType;
  fixedTerm: boolean;
  startDate: string;
  endDate?: string;
  noticePeriodDays?: number;
  notes?: string;
  amount?: number;
  currency?: Currency;
  partner: ContractPartner;
}

/* ================= CREATE REQUEST ================= */

// Ez a backend CreateContractRequest DTO-jához igazodik.
export interface CreateContractRequest {
  title: string;
  referenceNumber?: string;
  contractType: ContractType;
  fixedTerm: boolean;
  startDate: string;
  endDate?: string;
  noticePeriodDays?: number;
  notes?: string;
  amount?: number;
  currency?: Currency;
  partnerId: number;
}
