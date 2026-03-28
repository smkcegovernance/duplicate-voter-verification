# SMKC Deposit Management System

## Overview
Complete deposit management portal for Sangli Miraj Kupwad City Municipal Corporation with three user roles:
- **Account Department**: Create and manage deposit requirements
- **Banks**: View requirements and submit interest rate quotes
- **Commissioner**: Authorize requirements and approve final bank selection

## Features

### 🔐 Authentication
- Role-based access control
- Secure login for all user types
- Session management with localStorage

### 💼 Account Department Features
- Create deposit requirements (callable/non-callable)
- Set deposit amount, period, and validity
- View all bank quotes with L1/L2/Ln ranking
- Finalize deposits with selected banks
- Comprehensive dashboard with statistics
- Bank registration and management

### 🏦 Bank Features
- View active deposit requirements
- Submit interest rate quotes
- Track quote rankings (L1/L2/Ln)
- View submission history
- Real-time ranking updates

### ✅ Commissioner Features
- Review pending requirements
- Authorize/reject requirements
- View all active and finalized deposits
- Access comprehensive reports
- Monitor system activity

### 📊 Key Functionality
- **L1/L2/Ln Ranking System**: Automatic ranking of banks by interest rate (highest to lowest)
- **Validity Period**: Requirements expire after set date, no more quotes accepted
- **Status Tracking**: Draft → Published → Finalized workflow
- **Real-time Updates**: Mock API simulates network delays for realistic UX

## File Structure

```
src/
├── app/(deposits)/deposits/
│   ├── login/                    # Login page
│   ├── account/                  # Account dept pages
│   │   ├── page.tsx             # Dashboard
│   │   ├── requirements/        # Create & manage requirements
│   │   ├── banks/               # Bank management
│   │   └── quotes/              # View & compare quotes
│   ├── bank/                     # Bank pages
│   │   ├── page.tsx             # Dashboard
│   │   ├── requirements/        # View & quote on requirements
│   │   └── quotes/              # My quotes
│   └── commissioner/             # Commissioner pages
│       ├── page.tsx             # Dashboard
│       ├── approvals/           # Pending authorizations
│       └── requirements/        # All requirements
├── components/deposits/
│   ├── DepositNavigation.tsx   # Role-based navigation
│   └── LoadingSpinner.tsx      # Modern loaders
└── lib/deposits/
    ├── types.ts                # TypeScript interfaces
    ├── auth.ts                 # Authentication service
    └── mockApi.ts              # Mock API with data

```

## Demo Credentials

### Account Department
- **Email**: account@smkc.gov.in
- **Password**: password123

### Commissioner
- **Email**: commissioner@smkc.gov.in
- **Password**: password123

### Banks
- **SBI**: bank@sbi.com / password123
- **HDFC**: bank@hdfc.com / password123
- **ICICI**: bank@icici.com / password123

## Usage Flow

### 1. Account Department Workflow
1. Login to account department
2. Create new deposit requirement
   - Enter scheme name (e.g., "Fixed Deposit 2025-Q1")
   - Set deposit type (callable/non-callable)
   - Enter amount in crores
   - Set deposit period in months
   - Set validity period
3. Wait for Commissioner authorization
4. After authorization, banks can submit quotes
5. View and compare bank quotes with L1/L2/Ln rankings
6. Finalize deposit with L1 (highest rate) bank

### 2. Commissioner Workflow
1. Login to commissioner portal
2. View pending authorizations
3. Review requirement details
4. Authorize or reject requirements
5. Monitor finalized deposits

### 3. Bank Workflow
1. Login to bank portal
2. View active deposit requirements
3. Select a requirement
4. Submit interest rate quote with remarks
5. View your ranking (L1/L2/Ln)
6. Track quote status (submitted/selected/rejected)

## Technical Features

### Modern UX
- ✅ Loading spinners during API calls
- ✅ Navigation transition indicators
- ✅ Disabled states during submissions
- ✅ Success/error feedback
- ✅ Responsive design (mobile-friendly)
- ✅ Modern gradient backgrounds
- ✅ Professional color scheme

### Best Practices
- ✅ TypeScript for type safety
- ✅ Client/Server component separation
- ✅ Mock API ready for real backend integration
- ✅ Role-based routing protection
- ✅ Form validation
- ✅ Network delay simulation
- ✅ Clean component architecture

## API Integration Points

All mock API functions in `src/lib/deposits/mockApi.ts` are ready to be replaced with real API calls:

```typescript
// Requirements
- mockApi.getRequirements(filters)
- mockApi.createRequirement(data)
- mockApi.authorizeRequirement(id, userId)
- mockApi.finalizeRequirement(id, bankId)

// Banks
- mockApi.getBanks()
- mockApi.createBank(data)

// Quotes
- mockApi.getQuotes(requirementId?, bankId?)
- mockApi.submitQuote(data)

// Dashboard
- mockApi.getDashboardStats(role, userId, bankId?)
```

## Ranking System

The L1/L2/Ln system automatically ranks banks:
- **L1** (Gold): Highest interest rate → 🥇 Priority selection
- **L2** (Silver): Second highest → 🥈 Backup option
- **L3+** (Bronze): Lower rates → 🥉 Alternative options

Rankings are recalculated whenever a new quote is submitted.

## Access URLs

- Login: http://localhost:3000/deposits/login
- Account Dashboard: http://localhost:3000/deposits/account
- Bank Dashboard: http://localhost:3000/deposits/bank
- Commissioner Dashboard: http://localhost:3000/deposits/commissioner

## Mock Data

The system includes pre-populated mock data:
- 3 deposit requirements (1 draft, 2 published)
- 4 registered banks
- 5 submitted quotes with rankings
- Real-world amounts (₹5 Cr - ₹7.5 Cr)
- Realistic interest rates (6.5% - 7.5%)

## Next Steps for Production

1. **Backend Integration**
   - Replace mockApi functions with real API calls
   - Implement JWT/session-based authentication
   - Add API endpoints matching mock structure

2. **Database Schema**
   - Users table (with roles)
   - Banks table
   - Requirements table
   - Quotes table
   - Add relationships and constraints

3. **Additional Features**
   - Email notifications
   - PDF report generation
   - Audit logs
   - Advanced filtering
   - Export to Excel
   - Document attachments

4. **Security**
   - Implement proper authentication
   - Add CSRF protection
   - Rate limiting
   - Input sanitization
   - Role-based API access control

## Support

For questions or issues, contact the development team.

---

**Built with**: Next.js 16, React 19, TypeScript, TailwindCSS 4
**Status**: ✅ Ready for testing and backend integration
