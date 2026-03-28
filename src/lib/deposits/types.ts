// User Roles
export type UserRole = 'account' | 'bank' | 'commissioner';

// User Interface
export interface User {
  id: string;
  userId?: string;
  role: UserRole;
  roleId?: number; // 1=Commissioner, 2=Account, 3=Bank
  email: string;
  name: string;
  status?: string; // A=Active, I=Inactive
  bankId?: string; // Only for bank users
  bankName?: string;
}

export interface UserProfile {
  userId: string;
  role: UserRole | 'unknown';
  roleId?: number;
  name: string;
  status?: string;
  bankId?: string;
  bankName?: string;
}

export interface ChangePasswordPayload {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

// API Response interface (UPPERCASE from .NET API)
export interface BankAPI {
  ID: string;
  NAME: string;
  BRANCH_ADDRESS: string;
  ADDRESS: string;
  MICR: string;
  IFSC: string;
  EMAIL: string;
  CONTACT_PERSON: string;
  CONTACT_NO?: string;
  PHONE: string;
  REGISTRATION_DATE?: string;
  STATUS?: 'active' | 'inactive';
}

// Bank Interface (camelCase for frontend use)
export interface Bank {
  id: string;
  name: string;
  branchAddress: string;
  address: string;
  micr: string;
  ifsc: string;
  email: string;
  contactPerson: string;
  contactNo?: string;
  phone: string;
  registrationDate?: string;
  status?: 'active' | 'inactive';
}

// Mapper functions for Bank
export function mapBankFromAPI(apiBank: BankAPI): Bank {
  const mapped = {
    id: apiBank.ID,
    name: apiBank.NAME,
    branchAddress: apiBank.BRANCH_ADDRESS,
    address: apiBank.ADDRESS,
    micr: apiBank.MICR,
    ifsc: apiBank.IFSC,
    email: apiBank.EMAIL,
    contactPerson: apiBank.CONTACT_PERSON,
    contactNo: apiBank.CONTACT_NO,
    phone: apiBank.PHONE,
    registrationDate: apiBank.REGISTRATION_DATE,
    status: apiBank.STATUS,
  };
  console.log('mapBankFromAPI - Input:', apiBank.ID, 'Output:', mapped.id);
  return mapped;
}

export function mapBankToAPI(bank: Partial<Bank>): Partial<BankAPI> {
  const apiBank: any = {};
  
  if (bank.id) apiBank.ID = bank.id;
  if (bank.name) apiBank.NAME = bank.name;
  if (bank.branchAddress) apiBank.BRANCH_ADDRESS = bank.branchAddress;
  if (bank.address) apiBank.ADDRESS = bank.address;
  if (bank.micr) apiBank.MICR = bank.micr;
  if (bank.ifsc) apiBank.IFSC = bank.ifsc;
  if (bank.email) apiBank.EMAIL = bank.email;
  if (bank.contactPerson) apiBank.CONTACT_PERSON = bank.contactPerson;
  if (bank.contactNo) apiBank.CONTACT_NO = bank.contactNo;
  if (bank.phone) apiBank.PHONE = bank.phone;
  if (bank.registrationDate) apiBank.REGISTRATION_DATE = bank.registrationDate;
  if (bank.status) apiBank.STATUS = bank.status;
  
  return apiBank;
}

// API Response interfaces (UPPERCASE from .NET API)
export interface DepositRequirementAPI {
  ID: string;
  SCHEME_NAME: string;
  DEPOSIT_TYPE: 'callable' | 'non-callable';
  AMOUNT: number;
  DEPOSIT_PERIOD: number; // in months
  VALIDITY_PERIOD: string; // ISO date string
  STATUS: 'draft' | 'published' | 'expired' | 'finalized';
  CREATED_BY: string;
  CREATED_AT: string;
  AUTHORIZED_BY?: string;
  AUTHORIZED_AT?: string;
  FINALIZED_BANK_ID?: string;
  FINALIZED_AT?: string;
  DESCRIPTION?: string;
}

// API Response for requirement details (nested structure)
export interface RequirementDetailsAPI {
  o_requirement: DepositRequirementAPI[];
  o_quotes: any[];  // We'll define quote types later
}

// Deposit Requirement (camelCase for frontend use)
export interface DepositRequirement {
  id: string;
  schemeName: string;
  depositType: 'callable' | 'non-callable';
  amount: number;
  depositPeriod: number; // in months
  validityPeriod: string; // ISO date string
  status: 'draft' | 'published' | 'expired' | 'finalized';
  createdBy: string;
  createdAt: string;
  authorizedBy?: string;
  authorizedAt?: string;
  finalizedBankId?: string;
  finalizedAt?: string;
  description?: string;
  specialConditions?: string; // alias for description when used in UI
}

// Mapper function to convert API response to camelCase
export function mapRequirementFromAPI(apiReq: DepositRequirementAPI): DepositRequirement {
  return {
    id: apiReq.ID,
    schemeName: apiReq.SCHEME_NAME,
    depositType: apiReq.DEPOSIT_TYPE,
    amount: apiReq.AMOUNT,
    depositPeriod: apiReq.DEPOSIT_PERIOD,
    validityPeriod: apiReq.VALIDITY_PERIOD,
    status: apiReq.STATUS,
    createdBy: apiReq.CREATED_BY,
    createdAt: apiReq.CREATED_AT,
    authorizedBy: apiReq.AUTHORIZED_BY,
    authorizedAt: apiReq.AUTHORIZED_AT,
    finalizedBankId: apiReq.FINALIZED_BANK_ID,
    finalizedAt: apiReq.FINALIZED_AT,
    description: apiReq.DESCRIPTION,
    specialConditions: apiReq.DESCRIPTION,
  };
}

// Mapper function to convert camelCase to API format (UPPERCASE)
export function mapRequirementToAPI(req: Partial<DepositRequirement>): Partial<DepositRequirementAPI> {
  const apiReq: any = {};
  
  if (req.id) apiReq.ID = req.id;
  if (req.schemeName) apiReq.SCHEME_NAME = req.schemeName;
  if (req.depositType) apiReq.DEPOSIT_TYPE = req.depositType;
  if (req.amount !== undefined) apiReq.AMOUNT = req.amount;
  if (req.depositPeriod !== undefined) apiReq.DEPOSIT_PERIOD = req.depositPeriod;
  if (req.validityPeriod) apiReq.VALIDITY_PERIOD = req.validityPeriod;
  if (req.status) apiReq.STATUS = req.status;
  if (req.createdBy) apiReq.CREATED_BY = req.createdBy;
  if (req.createdAt) apiReq.CREATED_AT = req.createdAt;
  if (req.authorizedBy) apiReq.AUTHORIZED_BY = req.authorizedBy;
  if (req.authorizedAt) apiReq.AUTHORIZED_AT = req.authorizedAt;
  if (req.finalizedBankId) apiReq.FINALIZED_BANK_ID = req.finalizedBankId;
  if (req.finalizedAt) apiReq.FINALIZED_AT = req.finalizedAt;
  if (req.description) apiReq.DESCRIPTION = req.description;
  
  return apiReq;
}

// Bank Quote
export interface BankQuote {
  id: string;
  requirementId: string;
  schemeName?: string;
  bankId: string;
  bankName: string;
  interestRate: number;
  remarks?: string;
  // Consent storage now on FTP; DB stores only file name
  consentFileName?: string; // FTP file name (e.g., guid_original.pdf)
  consentFileSize: number | null;
  consentUploadedAt: string | null;
  submittedAt: string;
  rank?: string; // L1, L2, L3, etc.
  ranking?: string; // L1, L2, Ln for display
  status: 'submitted' | 'selected' | 'rejected';
}

// Response from new consent download endpoint
export interface ConsentDocumentResponse {
  fileName: string;
  fileData: string;  // base64
  contentType: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRequirements?: number;
  activeRequirements?: number;
  expiredRequirements?: number;
  finalizedRequirements?: number;
  totalBanks?: number;
  activeBanks?: number;
  totalQuotes?: number;
  pendingAuthorizations?: number;
  myQuotes?: number;
  selectedQuotes?: number;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Filter Options
export interface RequirementFilters {
  status?: string;
  depositType?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// Payload for submitting quotes (frontend unchanged: base64 consent included)
export interface ConsentDocumentPayload {
  fileName: string;
  fileData?: string; // base64 data URL (deprecated)
  fileSize?: number;
}

export interface SubmitQuotePayload {
  requirementId: string;
  bankId: string;
  interestRate: number;
  remarks?: string;
  consentDocument?: ConsentDocumentPayload;
}
