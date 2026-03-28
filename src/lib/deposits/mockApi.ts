import { Bank, DepositRequirement, BankQuote, DashboardStats, SubmitQuotePayload } from './types';

// Mock Data Storage
let mockRequirements: DepositRequirement[] = [
  {
    id: 'REQ-001',
    schemeName: 'Fixed Deposit Scheme 2025-Q1',
    depositType: 'non-callable',
    amount: 50000000,
    depositPeriod: 12,
    validityPeriod: '2025-12-31T23:59:59',
    status: 'published',
    createdBy: 'acc-001',
    createdAt: '2025-12-01T10:00:00',
    authorizedBy: 'comm-001',
    authorizedAt: '2025-12-02T14:30:00',
    description: 'Annual fixed deposit for infrastructure development'
  },
  {
    id: 'REQ-002',
    schemeName: 'Callable Deposit - Education Fund',
    depositType: 'callable',
    amount: 25000000,
    depositPeriod: 6,
    validityPeriod: '2025-12-25T23:59:59',
    status: 'published',
    createdBy: 'acc-001',
    createdAt: '2025-12-05T09:00:00',
    authorizedBy: 'comm-001',
    authorizedAt: '2025-12-06T11:00:00',
    description: 'Short-term callable deposit for education initiatives'
  },
  {
    id: 'REQ-003',
    schemeName: 'Non-Callable Deposit - Road Development',
    depositType: 'non-callable',
    amount: 75000000,
    depositPeriod: 24,
    validityPeriod: '2025-12-20T23:59:59',
    status: 'draft',
    createdBy: 'acc-001',
    createdAt: '2025-12-10T15:00:00',
    description: 'Long-term deposit for road infrastructure projects'
  },
  {
    id: 'REQ-004',
    schemeName: 'Water Supply Project Deposit',
    depositType: 'non-callable',
    amount: 30000000,
    depositPeriod: 18,
    validityPeriod: '2026-01-15T23:59:59',
    status: 'published',
    createdBy: 'acc-001',
    createdAt: '2025-12-11T10:00:00',
    authorizedBy: 'comm-001',
    authorizedAt: '2025-12-11T16:00:00',
    description: 'Medium-term deposit for water supply infrastructure - NO QUOTES YET'
  }
];

let mockBanks: Bank[] = [
  {
    id: 'BNK-001',
    name: 'State Bank of India',
    branchAddress: 'Main Branch, Sangli, Maharashtra - 416416',
    address: 'Main Branch, Sangli, Maharashtra - 416416',
    micr: '416002001',
    ifsc: 'SBIN0001234',
    email: 'bank@sbi.com',
    contactPerson: 'Mr. Rajesh Kumar',
    contactNo: '+91-9876543210',
    phone: '+91-9876543210',
    registrationDate: '2025-01-15',
    status: 'active'
  },
  {
    id: 'BNK-002',
    name: 'HDFC Bank',
    branchAddress: 'Miraj Branch, Miraj, Maharashtra - 416410',
    address: 'Miraj Branch, Miraj, Maharashtra - 416410',
    micr: '416240002',
    ifsc: 'HDFC0001567',
    email: 'bank@hdfc.com',
    contactPerson: 'Ms. Priya Sharma',
    contactNo: '+91-9876543211',
    phone: '+91-9876543211',
    registrationDate: '2025-01-20',
    status: 'active'
  },
  {
    id: 'BNK-003',
    name: 'ICICI Bank',
    branchAddress: 'Kupwad Branch, Kupwad, Maharashtra - 416436',
    address: 'Kupwad Branch, Kupwad, Maharashtra - 416436',
    micr: '416229003',
    ifsc: 'ICIC0001890',
    email: 'bank@icici.com',
    contactPerson: 'Mr. Amit Patel',
    contactNo: '+91-9876543212',
    phone: '+91-9876543212',
    registrationDate: '2025-02-01',
    status: 'active'
  },
  {
    id: 'BNK-004',
    name: 'Bank of Maharashtra',
    branchAddress: 'City Branch, Sangli, Maharashtra - 416416',
    address: 'City Branch, Sangli, Maharashtra - 416416',
    micr: '416014004',
    ifsc: 'MAHB0001234',
    email: 'bank@mahabank.com',
    contactPerson: 'Mr. Suresh Desai',
    contactNo: '+91-9876543213',
    phone: '+91-9876543213',
    registrationDate: '2025-02-10',
    status: 'active'
  }
];

let mockQuotes: BankQuote[] = [
  {
    id: 'QT-001',
    requirementId: 'REQ-001',
    bankId: 'BNK-001',
    bankName: 'State Bank of India',
    interestRate: 7.5,
    remarks: 'Competitive rate with flexible terms',
    submittedAt: '2025-12-03T10:00:00',
    rank: 'L1',
    ranking: 'L1',
    status: 'submitted',
    consentFileName: undefined,
    consentFileSize: null,
    consentUploadedAt: null
  },
  {
    id: 'QT-002',
    requirementId: 'REQ-001',
    bankId: 'BNK-002',
    bankName: 'HDFC Bank',
    interestRate: 7.25,
    remarks: 'Best rates for long-term deposits',
    submittedAt: '2025-12-03T11:30:00',
    rank: 'L2',
    ranking: 'L2',
    status: 'submitted',
    consentFileName: undefined,
    consentFileSize: null,
    consentUploadedAt: null
  },
  {
    id: 'QT-003',
    requirementId: 'REQ-001',
    bankId: 'BNK-003',
    bankName: 'ICICI Bank',
    interestRate: 7.0,
    remarks: 'Stable and secure investment',
    submittedAt: '2025-12-03T14:00:00',
    rank: 'L3',
    ranking: 'L3',
    status: 'submitted',
    consentFileName: undefined,
    consentFileSize: null,
    consentUploadedAt: null
  },
  {
    id: 'QT-004',
    requirementId: 'REQ-002',
    bankId: 'BNK-001',
    bankName: 'State Bank of India',
    interestRate: 6.5,
    remarks: 'Callable deposit with premium rate',
    submittedAt: '2025-12-07T09:00:00',
    rank: 'L2',
    ranking: 'L2',
    status: 'submitted',
    consentFileName: undefined,
    consentFileSize: null,
    consentUploadedAt: null
  },
  {
    id: 'QT-005',
    requirementId: 'REQ-002',
    bankId: 'BNK-004',
    bankName: 'Bank of Maharashtra',
    interestRate: 6.75,
    remarks: 'Best callable deposit rates',
    submittedAt: '2025-12-07T10:30:00',
    rank: 'L1',
    ranking: 'L1',
    status: 'submitted',
    consentFileName: undefined,
    consentFileSize: null,
    consentUploadedAt: null
  }
];

// Calculate rankings for quotes
export const calculateRankings = (requirementId: string) => {
  const quotes = mockQuotes.filter(q => q.requirementId === requirementId);
  const sorted = quotes.sort((a, b) => b.interestRate - a.interestRate);
  
  sorted.forEach((quote, index) => {
    quote.rank = `L${index + 1}`;
    quote.ranking = `L${index + 1}`;
  });
};

// Mock API Functions
export const mockApi = {
  // Requirements
  getRequirements: async (filters?: any): Promise<DepositRequirement[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    let filtered = [...mockRequirements];
    
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters?.depositType) {
      filtered = filtered.filter(r => r.depositType === filters.depositType);
    }
    
    return filtered;
  },

  getRequirement: async (id: string): Promise<DepositRequirement | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRequirements.find(r => r.id === id) || null;
  },

  createRequirement: async (data: Partial<DepositRequirement>): Promise<DepositRequirement> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newReq: DepositRequirement = {
      id: `REQ-${String(mockRequirements.length + 1).padStart(3, '0')}`,
      schemeName: data.schemeName || '',
      depositType: data.depositType || 'non-callable',
      amount: data.amount || 0,
      depositPeriod: data.depositPeriod || 12,
      validityPeriod: data.validityPeriod || '',
      status: 'draft',
      createdBy: data.createdBy || 'acc-001',
      createdAt: new Date().toISOString(),
      description: data.description
    };
    mockRequirements.push(newReq);
    return newReq;
  },

  updateRequirement: async (id: string, data: Partial<DepositRequirement>): Promise<DepositRequirement> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockRequirements.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequirements[index] = { ...mockRequirements[index], ...data };
      return mockRequirements[index];
    }
    throw new Error('Requirement not found');
  },

  authorizeRequirement: async (id: string, userId: string): Promise<DepositRequirement> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockRequirements.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequirements[index] = {
        ...mockRequirements[index],
        status: 'published',
        authorizedBy: userId,
        authorizedAt: new Date().toISOString()
      };
      return mockRequirements[index];
    }
    throw new Error('Requirement not found');
  },

  finalizeRequirement: async (id: string, bankId: string): Promise<DepositRequirement> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockRequirements.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequirements[index] = {
        ...mockRequirements[index],
        status: 'finalized',
        finalizedBankId: bankId,
        finalizedAt: new Date().toISOString()
      };
      
      // Update quote status
      mockQuotes.forEach(q => {
        if (q.requirementId === id) {
          q.status = q.bankId === bankId ? 'selected' : 'rejected';
        }
      });
      
      return mockRequirements[index];
    }
    throw new Error('Requirement not found');
  },

  // Banks
  getBanks: async (): Promise<Bank[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockBanks];
  },

  getBank: async (id: string): Promise<Bank | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBanks.find(b => b.id === id) || null;
  },

  createBank: async (data: Partial<Bank>): Promise<Bank> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBank: Bank = {
      id: `BNK-${String(mockBanks.length + 1).padStart(3, '0')}`,
      name: data.name || '',
      branchAddress: data.branchAddress || data.address || '',
      address: data.address || data.branchAddress || '',
      micr: data.micr || '',
      ifsc: data.ifsc || '',
      email: data.email || '',
      contactPerson: data.contactPerson || '',
      contactNo: data.contactNo || data.phone || '',
      phone: data.phone || data.contactNo || '',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    mockBanks.push(newBank);
    return newBank;
  },

  // Quotes
  getQuotes: async (requirementId?: string, bankId?: string): Promise<BankQuote[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    let filtered = [...mockQuotes];
    
    if (requirementId) {
      filtered = filtered.filter(q => q.requirementId === requirementId);
      calculateRankings(requirementId);
    }
    if (bankId) {
      filtered = filtered.filter(q => q.bankId === bankId);
    }
    
    // Ensure all quotes have bankName populated
    filtered.forEach(quote => {
      if (!quote.bankName) {
        const bank = mockBanks.find(b => b.id === quote.bankId);
        quote.bankName = bank?.name || '';
      }
    });
    
    return filtered;
  },

  submitQuote: async (data: SubmitQuotePayload): Promise<BankQuote> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get bank name
    const bank = mockBanks.find(b => b.id === data.bankId);
    
    // Check if updating existing quote
    const existingIndex = mockQuotes.findIndex(
      q => q.requirementId === data.requirementId && q.bankId === data.bankId
    );
    
    if (existingIndex !== -1) {
      // Update existing quote
      mockQuotes[existingIndex] = {
        ...mockQuotes[existingIndex],
        interestRate: data.interestRate || mockQuotes[existingIndex].interestRate,
        remarks: data.remarks,
        consentFileName: data.consentDocument?.fileName || mockQuotes[existingIndex].consentFileName,
        consentFileSize: null,
        consentUploadedAt: null,
        submittedAt: new Date().toISOString()
      };
      
      // Recalculate rankings
      calculateRankings(mockQuotes[existingIndex].requirementId);
      
      return mockQuotes[existingIndex];
    } else {
      // Create new quote
      const newQuote: BankQuote = {
        id: `QT-${String(mockQuotes.length + 1).padStart(3, '0')}`,
        requirementId: data.requirementId || '',
        bankId: data.bankId || '',
        bankName: bank?.name || '',
        interestRate: data.interestRate || 0,
        remarks: data.remarks,
        consentFileName: data.consentDocument?.fileName,
        consentFileSize: null,
        consentUploadedAt: null,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };
      mockQuotes.push(newQuote);
      
      // Recalculate rankings
      calculateRankings(newQuote.requirementId);
      
      return newQuote;
    }
  },

  // Dashboard Stats
  getDashboardStats: async (role: string, userId: string, bankId?: string): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (role === 'account') {
      return {
        totalRequirements: mockRequirements.length,
        activeRequirements: mockRequirements.filter(r => r.status === 'published').length,
        expiredRequirements: mockRequirements.filter(r => r.status === 'expired').length,
        finalizedRequirements: mockRequirements.filter(r => r.status === 'finalized').length,
        totalBanks: mockBanks.length,
        activeBanks: mockBanks.filter(b => b.status === 'active').length,
        totalQuotes: mockQuotes.length
      };
    } else if (role === 'commissioner') {
      return {
        totalRequirements: mockRequirements.length,
        pendingAuthorizations: mockRequirements.filter(r => r.status === 'draft').length,
        activeRequirements: mockRequirements.filter(r => r.status === 'published').length,
        finalizedRequirements: mockRequirements.filter(r => r.status === 'finalized').length,
        totalBanks: mockBanks.length,
        totalQuotes: mockQuotes.length
      };
    } else if (role === 'bank' && bankId) {
      const myQuotes = mockQuotes.filter(q => q.bankId === bankId);
      return {
        activeRequirements: mockRequirements.filter(r => r.status === 'published' && new Date(r.validityPeriod) > new Date()).length,
        myQuotes: myQuotes.length,
        selectedQuotes: myQuotes.filter(q => q.status === 'selected').length,
        totalRequirements: mockRequirements.filter(r => r.status === 'published').length
      };
    }
    
    return {};
  }
};
