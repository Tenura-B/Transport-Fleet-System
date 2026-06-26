export class CreateCompanyDto {
  name: string;
  logoUrl?: string;
  domain?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}
