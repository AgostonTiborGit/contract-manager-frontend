export interface ContractFile {
  id: number;
  displayName?: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  primaryFile: boolean;
}
