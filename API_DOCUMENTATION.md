# SMKC Deposit Management System - API Documentation

## Overview
This document provides complete API specifications for the SMKC Deposit Management System. All APIs are segregated by user roles: Bank Users, Account Department Users, and Commissioner Users.

**Base URL:** `/api/deposits`

**Common Response Structure:**
All API responses include these common fields:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array (optional)
}
```

---

## 1. BANK USER APIs

### 1.1 Authentication

#### Bank Login
**Endpoint:** `POST /api/auth/bank/login`

**Request:**
```json
{
  "email": "bank@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "role": "bank",
      "email": "string",
      "name": "string",
      "bankId": "string"
    },
    "token": "string"
  }
}
```

---

### 1.2 Dashboard

#### Get Bank Dashboard Stats
**Endpoint:** `GET /api/deposits/bank/dashboard/stats`

**Query Parameters:**
- `bankId` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "activeRequirements": number,
    "myQuotes": number,
    "selectedQuotes": number,
    "totalRequirements": number
  }
}
```

---

### 1.3 Requirements

#### Get All Published Requirements (Bank View)
**Endpoint:** `GET /api/deposits/bank/requirements`

**Query Parameters:**
- `status`: "published" (default)
- `depositType`: "callable" | "non-callable" (optional)

**Response:**
```json
{
  "success": true,
  "message": "Requirements retrieved successfully",
  "data": [
    {
      "id": "string",
      "schemeName": "string",
      "depositType": "callable" | "non-callable",
      "amount": number,
      "depositPeriod": number,
      "validityPeriod": "ISO date string",
      "status": "published",
      "createdAt": "ISO date string",
      "description": "string"
    }
  ]
}
```

#### Get Requirement Details
**Endpoint:** `GET /api/deposits/bank/requirements/{id}`

**Path Parameters:**
- `id` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Requirement details retrieved successfully",
  "data": {
    "id": "string",
    "schemeName": "string",
    "depositType": "callable" | "non-callable",
    "amount": number,
    "depositPeriod": number,
    "validityPeriod": "ISO date string",
    "status": "published",
    "createdBy": "string",
    "createdAt": "ISO date string",
    "description": "string"
  }
}
```

---

### 1.4 Quotes

#### Get Bank's Quotes
**Endpoint:** `GET /api/deposits/bank/quotes`

**Query Parameters:**
- `bankId` (required): string
- `requirementId` (optional): string

**Response:**
```json
{
  "success": true,
  "message": "Quotes retrieved successfully",
  "data": [
    {
      "id": "string",
      "requirementId": "string",
      "bankId": "string",
      "bankName": "string",
      "interestRate": number,
      "remarks": "string",
      "consentDocument": {
        "fileName": "string",
        "fileData": "base64 string",
        "fileSize": number,
        "uploadedAt": "ISO date string"
      },
      "submittedAt": "ISO date string",
      "status": "submitted" | "selected" | "rejected"
    }
  ]
}
```

#### Submit/Update Quote
**Endpoint:** `POST /api/deposits/bank/quotes/submit`

**Request:**
```json
{
  "requirementId": "string",
  "bankId": "string",
  "interestRate": number,
  "remarks": "string",
  "consentDocument": {
    "fileName": "string",
    "fileData": "base64 string",
    "fileSize": number,
    "uploadedAt": "ISO date string"
  }
}
```

**Validation Rules:**
- `interestRate`: Must be > 0 and <= 20
- `consentDocument`: Required
  - Allowed file types: PDF, JPG, JPEG
  - Maximum file size: 5MB
  - Must be base64 encoded

**Response:**
```json
{
  "success": true,
  "message": "Quote submitted successfully",
  "data": {
    "id": "string",
    "requirementId": "string",
    "bankId": "string",
    "bankName": "string",
    "interestRate": number,
    "remarks": "string",
    "consentDocument": {
      "fileName": "string",
      "fileData": "base64 string",
      "fileSize": number,
      "uploadedAt": "ISO date string"
    },
    "submittedAt": "ISO date string",
    "status": "submitted"
  }
}
```

#### Check If Quote Exists
**Endpoint:** `GET /api/deposits/bank/quotes/check`

**Query Parameters:**
- `requirementId` (required): string
- `bankId` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Quote check completed",
  "data": {
    "hasQuote": boolean,
    "quoteId": "string" | null
  }
}
```

---

### 1.5 Quote History

#### Get Quote History
**Endpoint:** `GET /api/deposits/bank/history`

**Query Parameters:**
- `bankId` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Quote history retrieved successfully",
  "data": [
    {
      "id": "string",
      "requirementId": "string",
      "schemeName": "string",
      "interestRate": number,
      "submittedAt": "ISO date string",
      "status": "submitted" | "selected" | "rejected"
    }
  ]
}
```

---

## 2. ACCOUNT DEPARTMENT USER APIs

### 2.1 Authentication

#### Account Login
**Endpoint:** `POST /api/auth/account/login`

**Request:**
```json
{
  "email": "account@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "role": "account",
      "email": "string",
      "name": "string"
    },
    "token": "string"
  }
}
```

---

### 2.2 Dashboard

#### Get Account Dashboard Stats
**Endpoint:** `GET /api/deposits/account/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalRequirements": number,
    "activeRequirements": number,
    "expiredRequirements": number,
    "finalizedRequirements": number,
    "totalBanks": number,
    "activeBanks": number,
    "totalQuotes": number
  }
}
```

---

### 2.3 Requirements Management

#### Get All Requirements
**Endpoint:** `GET /api/deposits/account/requirements`

**Query Parameters:**
- `status` (optional): "draft" | "published" | "expired" | "finalized"
- `depositType` (optional): "callable" | "non-callable"
- `fromDate` (optional): ISO date string
- `toDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "message": "Requirements retrieved successfully",
  "data": [
    {
      "id": "string",
      "schemeName": "string",
      "depositType": "callable" | "non-callable",
      "amount": number,
      "depositPeriod": number,
      "validityPeriod": "ISO date string",
      "status": "draft" | "published" | "expired" | "finalized",
      "createdBy": "string",
      "createdAt": "ISO date string",
      "authorizedBy": "string",
      "authorizedAt": "ISO date string",
      "finalizedBankId": "string",
      "finalizedAt": "ISO date string",
      "description": "string"
    }
  ]
}
```

#### Get Requirement Details
**Endpoint:** `GET /api/deposits/account/requirements/{id}`

**Path Parameters:**
- `id` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Requirement details retrieved successfully",
  "data": {
    "id": "string",
    "schemeName": "string",
    "depositType": "callable" | "non-callable",
    "amount": number,
    "depositPeriod": number,
    "validityPeriod": "ISO date string",
    "status": "draft" | "published" | "expired" | "finalized",
    "createdBy": "string",
    "createdAt": "ISO date string",
    "authorizedBy": "string",
    "authorizedAt": "ISO date string",
    "finalizedBankId": "string",
    "finalizedAt": "ISO date string",
    "description": "string"
  }
}
```

#### Create Requirement
**Endpoint:** `POST /api/deposits/account/requirements/create`

**Request:**
```json
{
  "schemeName": "string",
  "depositType": "callable" | "non-callable",
  "amount": number,
  "depositPeriod": number,
  "validityPeriod": "ISO date string",
  "description": "string",
  "createdBy": "string"
}
```

**Validation Rules:**
- `amount`: Must be > 0
- `depositPeriod`: Must be > 0
- `validityPeriod`: Must be future date
- `schemeName`: Required, min 3 characters

**Response:**
```json
{
  "success": true,
  "message": "Requirement created successfully",
  "data": {
    "id": "string",
    "schemeName": "string",
    "depositType": "callable" | "non-callable",
    "amount": number,
    "depositPeriod": number,
    "validityPeriod": "ISO date string",
    "status": "draft",
    "createdBy": "string",
    "createdAt": "ISO date string",
    "description": "string"
  }
}
```

#### Update Requirement
**Endpoint:** `PUT /api/deposits/account/requirements/{id}`

**Path Parameters:**
- `id` (required): string

**Request:**
```json
{
  "schemeName": "string",
  "depositType": "callable" | "non-callable",
  "amount": number,
  "depositPeriod": number,
  "validityPeriod": "ISO date string",
  "description": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Requirement updated successfully",
  "data": {
    "id": "string",
    "schemeName": "string",
    "depositType": "callable" | "non-callable",
    "amount": number,
    "depositPeriod": number,
    "validityPeriod": "ISO date string",
    "status": "draft" | "published" | "expired" | "finalized",
    "createdBy": "string",
    "createdAt": "ISO date string",
    "description": "string"
  }
}
```

---

### 2.4 Bank Management

#### Get All Banks
**Endpoint:** `GET /api/deposits/account/banks`

**Query Parameters:**
- `status` (optional): "active" | "inactive"

**Response:**
```json
{
  "success": true,
  "message": "Banks retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "branchAddress": "string",
      "address": "string",
      "micr": "string",
      "ifsc": "string",
      "email": "string",
      "contactPerson": "string",
      "contactNo": "string",
      "phone": "string",
      "registrationDate": "ISO date string",
      "status": "active" | "inactive"
    }
  ]
}
```

#### Get Bank Details
**Endpoint:** `GET /api/deposits/account/banks/{id}`

**Path Parameters:**
- `id` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Bank details retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "branchAddress": "string",
    "address": "string",
    "micr": "string",
    "ifsc": "string",
    "email": "string",
    "contactPerson": "string",
    "contactNo": "string",
    "phone": "string",
    "registrationDate": "ISO date string",
    "status": "active" | "inactive"
  }
}
```

#### Create Bank
**Endpoint:** `POST /api/deposits/account/banks/create`

**Request:**
```json
{
  "name": "string",
  "branchAddress": "string",
  "address": "string",
  "micr": "string",
  "ifsc": "string",
  "email": "string",
  "contactPerson": "string",
  "contactNo": "string",
  "phone": "string"
}
```

**Validation Rules:**
- `name`: Required, min 3 characters
- `email`: Valid email format
- `ifsc`: 11 characters alphanumeric
- `micr`: 9 digits
- `phone`/`contactNo`: 10 digits

**Response:**
```json
{
  "success": true,
  "message": "Bank created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "branchAddress": "string",
    "address": "string",
    "micr": "string",
    "ifsc": "string",
    "email": "string",
    "contactPerson": "string",
    "contactNo": "string",
    "phone": "string",
    "registrationDate": "ISO date string",
    "status": "active"
  }
}
```

---

### 2.5 Quotes Management

#### Get All Quotes
**Endpoint:** `GET /api/deposits/account/quotes`

**Query Parameters:**
- `requirementId` (optional): string
- `bankId` (optional): string

**Response:**
```json
{
  "success": true,
  "message": "Quotes retrieved successfully",
  "data": [
    {
      "id": "string",
      "requirementId": "string",
      "bankId": "string",
      "bankName": "string",
      "interestRate": number,
      "remarks": "string",
      "consentDocument": {
        "fileName": "string",
        "fileData": "base64 string",
        "fileSize": number,
        "uploadedAt": "ISO date string"
      },
      "submittedAt": "ISO date string",
      "rank": "L1" | "L2" | "L3" | "Ln",
      "status": "submitted" | "selected" | "rejected"
    }
  ]
}
```

**Note:** Rankings are calculated based on interest rate (highest = L1, second highest = L2, etc.)

---

### 2.6 Reports

#### Get Account Reports
**Endpoint:** `GET /api/deposits/account/reports`

**Query Parameters:**
- `fromDate` (optional): ISO date string
- `toDate` (optional): ISO date string
- `reportType` (optional): "summary" | "detailed"

**Response:**
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": {
    "summary": {
      "totalRequirements": number,
      "totalAmount": number,
      "totalQuotes": number,
      "averageInterestRate": number,
      "pendingRequirements": number,
      "publishedRequirements": number,
      "finalizedRequirements": number
    },
    "requirements": [
      {
        "id": "string",
        "schemeName": "string",
        "amount": number,
        "status": "string",
        "quotesReceived": number,
        "bestRate": number
      }
    ]
  }
}
```

---

## 3. COMMISSIONER USER APIs

### 3.1 Authentication

#### Commissioner Login
**Endpoint:** `POST /api/auth/commissioner/login`

**Request:**
```json
{
  "email": "commissioner@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "role": "commissioner",
      "email": "string",
      "name": "string"
    },
    "token": "string"
  }
}
```

---

### 3.2 Dashboard

#### Get Commissioner Dashboard Stats
**Endpoint:** `GET /api/deposits/commissioner/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalRequirements": number,
    "pendingAuthorizations": number,
    "activeRequirements": number,
    "finalizedRequirements": number,
    "totalBanks": number,
    "totalQuotes": number
  }
}
```

#### Get Pending Authorization Requirements
**Endpoint:** `GET /api/deposits/commissioner/dashboard/pending`

**Response:**
```json
{
  "success": true,
  "message": "Pending requirements retrieved successfully",
  "data": [
    {
      "id": "string",
      "schemeName": "string",
      "depositType": "callable" | "non-callable",
      "amount": number,
      "depositPeriod": number,
      "validityPeriod": "ISO date string",
      "status": "draft",
      "createdBy": "string",
      "createdAt": "ISO date string",
      "description": "string"
    }
  ]
}
```

---

### 3.3 Requirement Authorization

#### Get All Requirements (Commissioner View)
**Endpoint:** `GET /api/deposits/commissioner/requirements`

**Query Parameters:**
- `status` (optional): "draft" | "published" | "finalized"

**Response:**
```json
{
  "success": true,
  "message": "Requirements retrieved successfully",
  "data": [
    {
      "id": "string",
      "schemeName": "string",
      "depositType": "callable" | "non-callable",
      "amount": number,
      "depositPeriod": number,
      "validityPeriod": "ISO date string",
      "status": "draft" | "published" | "expired" | "finalized",
      "createdBy": "string",
      "createdAt": "ISO date string",
      "authorizedBy": "string",
      "authorizedAt": "ISO date string",
      "finalizedBankId": "string",
      "finalizedAt": "ISO date string",
      "description": "string"
    }
  ]
}
```

#### Get Requirement Details with Quotes
**Endpoint:** `GET /api/deposits/commissioner/requirements/{id}`

**Path Parameters:**
- `id` (required): string

**Response:**
```json
{
  "success": true,
  "message": "Requirement details retrieved successfully",
  "data": {
    "requirement": {
      "id": "string",
      "schemeName": "string",
      "depositType": "callable" | "non-callable",
      "amount": number,
      "depositPeriod": number,
      "validityPeriod": "ISO date string",
      "status": "draft" | "published" | "expired" | "finalized",
      "createdBy": "string",
      "createdAt": "ISO date string",
      "authorizedBy": "string",
      "authorizedAt": "ISO date string",
      "description": "string"
    },
    "quotes": [
      {
        "id": "string",
        "requirementId": "string",
        "bankId": "string",
        "bankName": "string",
        "interestRate": number,
        "remarks": "string",
        "consentDocument": {
          "fileName": "string",
          "fileData": "base64 string",
          "fileSize": number,
          "uploadedAt": "ISO date string"
        },
        "submittedAt": "ISO date string",
        "rank": "L1" | "L2" | "L3" | "Ln",
        "status": "submitted" | "selected" | "rejected"
      }
    ]
  }
}
```

#### Authorize Requirement
**Endpoint:** `POST /api/deposits/commissioner/requirements/{id}/authorize`

**Path Parameters:**
- `id` (required): string

**Request:**
```json
{
  "commissionerId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Requirement authorized successfully",
  "data": {
    "id": "string",
    "schemeName": "string",
    "depositType": "callable" | "non-callable",
    "amount": number,
    "depositPeriod": number,
    "validityPeriod": "ISO date string",
    "status": "published",
    "createdBy": "string",
    "createdAt": "ISO date string",
    "authorizedBy": "string",
    "authorizedAt": "ISO date string",
    "description": "string"
  }
}
```

---

### 3.4 Quotes and Finalization

#### Get All Quotes with Rankings
**Endpoint:** `GET /api/deposits/commissioner/quotes`

**Query Parameters:**
- `requirementId` (optional): string

**Response:**
```json
{
  "success": true,
  "message": "Quotes retrieved successfully",
  "data": [
    {
      "id": "string",
      "requirementId": "string",
      "bankId": "string",
      "bankName": "string",
      "interestRate": number,
      "remarks": "string",
      "consentDocument": {
        "fileName": "string",
        "fileData": "base64 string",
        "fileSize": number,
        "uploadedAt": "ISO date string"
      },
      "submittedAt": "ISO date string",
      "rank": "L1" | "L2" | "L3" | "Ln",
      "status": "submitted" | "selected" | "rejected"
    }
  ]
}
```

#### Finalize Deposit
**Endpoint:** `POST /api/deposits/commissioner/requirements/{id}/finalize`

**Path Parameters:**
- `id` (required): string (requirement ID)

**Request:**
```json
{
  "bankId": "string"
}
```

**Validation Rules:**
- Only L1 (highest interest rate) quotes with "submitted" status can be finalized
- Requirement must be in "published" status
- Cannot finalize already finalized requirements

**Response:**
```json
{
  "success": true,
  "message": "Deposit finalized successfully",
  "data": {
    "requirement": {
      "id": "string",
      "schemeName": "string",
      "status": "finalized",
      "finalizedBankId": "string",
      "finalizedAt": "ISO date string"
    },
    "selectedQuote": {
      "id": "string",
      "bankName": "string",
      "interestRate": number,
      "status": "selected"
    }
  }
}
```

---

### 3.5 Reports and Analytics

#### Get Commissioner Reports
**Endpoint:** `GET /api/deposits/commissioner/reports`

**Query Parameters:**
- `fromDate` (optional): ISO date string
- `toDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": {
    "summary": {
      "totalRequirements": number,
      "totalAmount": number,
      "totalQuotes": number,
      "averageInterestRate": number,
      "pendingAuthorizations": number,
      "publishedRequirements": number,
      "finalizedRequirements": number
    },
    "statusBreakdown": {
      "draft": [
        {
          "id": "string",
          "schemeName": "string",
          "amount": number,
          "createdAt": "ISO date string"
        }
      ],
      "published": [
        {
          "id": "string",
          "schemeName": "string",
          "amount": number,
          "quotesCount": number
        }
      ],
      "finalized": [
        {
          "id": "string",
          "schemeName": "string",
          "amount": number,
          "finalizedBankName": "string",
          "interestRate": number,
          "finalizedAt": "ISO date string"
        }
      ]
    }
  }
}
```

#### Get Approval History
**Endpoint:** `GET /api/deposits/commissioner/approvals/history`

**Query Parameters:**
- `fromDate` (optional): ISO date string
- `toDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "message": "Approval history retrieved successfully",
  "data": [
    {
      "requirementId": "string",
      "schemeName": "string",
      "amount": number,
      "authorizedBy": "string",
      "authorizedAt": "ISO date string",
      "currentStatus": "published" | "finalized"
    }
  ]
}
```

---

## 4. COMMON ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "error": "Detailed error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Insufficient permissions for this operation"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "The requested resource does not exist"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Operation conflict",
  "error": "Quote already exists for this requirement"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## 5. DATA VALIDATION RULES

### Amount Values
- All amounts are stored in Rupees (integer)
- Display conversion: Amount ÷ 100000 = Lakhs
- Minimum amount: 1,00,000 (1 Lakh)
- Maximum amount: 1,00,00,00,000 (1000 Crores)

### Interest Rates
- Stored as decimal (e.g., 7.5)
- Valid range: 0.01 to 20.00
- Display with 2 decimal places

### Date Formats
- All dates in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`
- Validity periods must be future dates
- Dates stored in UTC timezone

### File Uploads (Consent Documents)
- Allowed formats: PDF (.pdf), JPEG (.jpg, .jpeg)
- Maximum file size: 5MB (5,242,880 bytes)
- Encoding: Base64
- Required fields: fileName, fileData, fileSize, uploadedAt

### String Validations
- Scheme Name: 3-200 characters
- Bank Name: 3-100 characters
- Email: Valid email format
- IFSC Code: 11 alphanumeric characters
- MICR Code: 9 digits
- Phone/Contact: 10 digits

---

## 6. BUSINESS LOGIC RULES

### Requirement Status Flow
```
draft → (authorize) → published → (finalize) → finalized
                                ↓
                            expired (if validity period passes)
```

### Quote Ranking System
- L1: Highest interest rate (best offer)
- L2: Second highest interest rate
- L3: Third highest interest rate
- Ln: Remaining quotes in descending order
- Rankings recalculated on every quote submission/update

### Authorization Rules
- Only Commissioner can authorize requirements
- Requirements must be in "draft" status to be authorized
- Authorization changes status to "published"

### Finalization Rules
- Only Commissioner can finalize deposits
- Only L1 quotes can be finalized
- Requirement must be in "published" status
- Selected quote status changes to "selected"
- All other quotes status changes to "rejected"
- Requirement status changes to "finalized"

### Visibility Rules
- **Bank Users:** Cannot see rankings, only their own quotes
- **Account Users:** Can see all quotes with rankings, cannot finalize
- **Commissioner Users:** Can see everything, can authorize and finalize

---

## 7. ORACLE STORED PROCEDURES MAPPING

### Bank User Procedures
```sql
-- Login
PROCEDURE SP_BANK_LOGIN(
  p_email VARCHAR2,
  p_password VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_user_data OUT SYS_REFCURSOR
)

-- Get Dashboard Stats
PROCEDURE SP_BANK_GET_DASHBOARD_STATS(
  p_bank_id VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_stats OUT SYS_REFCURSOR
)

-- Get Requirements
PROCEDURE SP_BANK_GET_REQUIREMENTS(
  p_status VARCHAR2 DEFAULT 'published',
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirements OUT SYS_REFCURSOR
)

-- Submit Quote
PROCEDURE SP_BANK_SUBMIT_QUOTE(
  p_requirement_id VARCHAR2,
  p_bank_id VARCHAR2,
  p_interest_rate NUMBER,
  p_remarks VARCHAR2,
  p_consent_file_name VARCHAR2,
  p_consent_file_data CLOB,
  p_consent_file_size NUMBER,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_quote_data OUT SYS_REFCURSOR
)

-- Get Quotes
PROCEDURE SP_BANK_GET_QUOTES(
  p_bank_id VARCHAR2,
  p_requirement_id VARCHAR2 DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_quotes OUT SYS_REFCURSOR
)
```

### Account User Procedures
```sql
-- Login
PROCEDURE SP_ACCOUNT_LOGIN(
  p_email VARCHAR2,
  p_password VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_user_data OUT SYS_REFCURSOR
)

-- Get Dashboard Stats
PROCEDURE SP_ACCOUNT_GET_DASHBOARD_STATS(
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_stats OUT SYS_REFCURSOR
)

-- Create Requirement
PROCEDURE SP_ACCOUNT_CREATE_REQUIREMENT(
  p_scheme_name VARCHAR2,
  p_deposit_type VARCHAR2,
  p_amount NUMBER,
  p_deposit_period NUMBER,
  p_validity_period TIMESTAMP,
  p_description VARCHAR2,
  p_created_by VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirement_data OUT SYS_REFCURSOR
)

-- Get Requirements
PROCEDURE SP_ACCOUNT_GET_REQUIREMENTS(
  p_status VARCHAR2 DEFAULT NULL,
  p_deposit_type VARCHAR2 DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirements OUT SYS_REFCURSOR
)

-- Create Bank
PROCEDURE SP_ACCOUNT_CREATE_BANK(
  p_name VARCHAR2,
  p_branch_address VARCHAR2,
  p_micr VARCHAR2,
  p_ifsc VARCHAR2,
  p_email VARCHAR2,
  p_contact_person VARCHAR2,
  p_phone VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_bank_data OUT SYS_REFCURSOR
)

-- Get All Banks
PROCEDURE SP_ACCOUNT_GET_BANKS(
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_banks OUT SYS_REFCURSOR
)

-- Get All Quotes with Rankings
PROCEDURE SP_ACCOUNT_GET_QUOTES(
  p_requirement_id VARCHAR2 DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_quotes OUT SYS_REFCURSOR
)
```

### Commissioner User Procedures
```sql
-- Login
PROCEDURE SP_COMMISSIONER_LOGIN(
  p_email VARCHAR2,
  p_password VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_user_data OUT SYS_REFCURSOR
)

-- Get Dashboard Stats
PROCEDURE SP_COMMISSIONER_GET_DASHBOARD_STATS(
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_stats OUT SYS_REFCURSOR
)

-- Get Pending Authorizations
PROCEDURE SP_COMMISSIONER_GET_PENDING(
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirements OUT SYS_REFCURSOR
)

-- Authorize Requirement
PROCEDURE SP_COMMISSIONER_AUTHORIZE_REQ(
  p_requirement_id VARCHAR2,
  p_commissioner_id VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirement_data OUT SYS_REFCURSOR
)

-- Get All Requirements
PROCEDURE SP_COMMISSIONER_GET_REQUIREMENTS(
  p_status VARCHAR2 DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirements OUT SYS_REFCURSOR
)

-- Get Requirement with Quotes
PROCEDURE SP_COMMISSIONER_GET_REQ_DETAILS(
  p_requirement_id VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_requirement OUT SYS_REFCURSOR,
  o_quotes OUT SYS_REFCURSOR
)

-- Get All Quotes with Rankings
PROCEDURE SP_COMMISSIONER_GET_QUOTES(
  p_requirement_id VARCHAR2 DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_quotes OUT SYS_REFCURSOR
)

-- Finalize Deposit
PROCEDURE SP_COMMISSIONER_FINALIZE_DEPOSIT(
  p_requirement_id VARCHAR2,
  p_bank_id VARCHAR2,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_result_data OUT SYS_REFCURSOR
)

-- Get Reports
PROCEDURE SP_COMMISSIONER_GET_REPORTS(
  p_from_date TIMESTAMP DEFAULT NULL,
  p_to_date TIMESTAMP DEFAULT NULL,
  o_success OUT NUMBER,
  o_message OUT VARCHAR2,
  o_summary OUT SYS_REFCURSOR,
  o_status_breakdown OUT SYS_REFCURSOR
)
```

---

## 8. DATABASE TABLES STRUCTURE

### Required Tables

#### TBL_USERS
```sql
CREATE TABLE TBL_USERS (
  USER_ID VARCHAR2(50) PRIMARY KEY,
  ROLE VARCHAR2(20) NOT NULL,
  EMAIL VARCHAR2(100) UNIQUE NOT NULL,
  PASSWORD_HASH VARCHAR2(255) NOT NULL,
  NAME VARCHAR2(100) NOT NULL,
  BANK_ID VARCHAR2(50),
  STATUS VARCHAR2(20) DEFAULT 'active',
  CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT CHK_ROLE CHECK (ROLE IN ('account', 'bank', 'commissioner'))
)
```

#### TBL_BANKS
```sql
CREATE TABLE TBL_BANKS (
  BANK_ID VARCHAR2(50) PRIMARY KEY,
  BANK_NAME VARCHAR2(100) NOT NULL,
  BRANCH_ADDRESS VARCHAR2(200),
  MICR VARCHAR2(9),
  IFSC VARCHAR2(11),
  EMAIL VARCHAR2(100),
  CONTACT_PERSON VARCHAR2(100),
  PHONE VARCHAR2(15),
  REGISTRATION_DATE DATE,
  STATUS VARCHAR2(20) DEFAULT 'active',
  CONSTRAINT CHK_BANK_STATUS CHECK (STATUS IN ('active', 'inactive'))
)
```

#### TBL_REQUIREMENTS
```sql
CREATE TABLE TBL_REQUIREMENTS (
  REQUIREMENT_ID VARCHAR2(50) PRIMARY KEY,
  SCHEME_NAME VARCHAR2(200) NOT NULL,
  DEPOSIT_TYPE VARCHAR2(20) NOT NULL,
  AMOUNT NUMBER(15,2) NOT NULL,
  DEPOSIT_PERIOD NUMBER(3) NOT NULL,
  VALIDITY_PERIOD TIMESTAMP NOT NULL,
  STATUS VARCHAR2(20) DEFAULT 'draft',
  CREATED_BY VARCHAR2(50),
  CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  AUTHORIZED_BY VARCHAR2(50),
  AUTHORIZED_AT TIMESTAMP,
  FINALIZED_BANK_ID VARCHAR2(50),
  FINALIZED_AT TIMESTAMP,
  DESCRIPTION CLOB,
  CONSTRAINT CHK_DEPOSIT_TYPE CHECK (DEPOSIT_TYPE IN ('callable', 'non-callable')),
  CONSTRAINT CHK_REQ_STATUS CHECK (STATUS IN ('draft', 'published', 'expired', 'finalized'))
)
```

#### TBL_QUOTES
```sql
CREATE TABLE TBL_QUOTES (
  QUOTE_ID VARCHAR2(50) PRIMARY KEY,
  REQUIREMENT_ID VARCHAR2(50) NOT NULL,
  BANK_ID VARCHAR2(50) NOT NULL,
  INTEREST_RATE NUMBER(5,2) NOT NULL,
  REMARKS CLOB,
  SUBMITTED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  RANK VARCHAR2(10),
  STATUS VARCHAR2(20) DEFAULT 'submitted',
  CONSTRAINT FK_QUOTE_REQ FOREIGN KEY (REQUIREMENT_ID) REFERENCES TBL_REQUIREMENTS(REQUIREMENT_ID),
  CONSTRAINT FK_QUOTE_BANK FOREIGN KEY (BANK_ID) REFERENCES TBL_BANKS(BANK_ID),
  CONSTRAINT CHK_QUOTE_STATUS CHECK (STATUS IN ('submitted', 'selected', 'rejected')),
  CONSTRAINT UNQ_REQ_BANK UNIQUE (REQUIREMENT_ID, BANK_ID)
)
```

#### TBL_CONSENT_DOCUMENTS
```sql
CREATE TABLE TBL_CONSENT_DOCUMENTS (
  DOCUMENT_ID VARCHAR2(50) PRIMARY KEY,
  QUOTE_ID VARCHAR2(50) NOT NULL,
  FILE_NAME VARCHAR2(200) NOT NULL,
  FILE_DATA BLOB NOT NULL,
  FILE_SIZE NUMBER(10) NOT NULL,
  UPLOADED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT FK_DOC_QUOTE FOREIGN KEY (QUOTE_ID) REFERENCES TBL_QUOTES(QUOTE_ID)
)
```

---

## 9. IMPLEMENTATION NOTES FOR .NET

### Recommended .NET API Structure
```
Controllers/
  - AuthController.cs
  - BankController.cs
  - AccountController.cs
  - CommissionerController.cs

Services/
  - AuthService.cs
  - BankService.cs
  - AccountService.cs
  - CommissionerService.cs
  - OracleDbService.cs

Models/
  - User.cs
  - Bank.cs
  - Requirement.cs
  - Quote.cs
  - ApiResponse.cs

DTOs/
  - LoginRequest.cs
  - CreateRequirementRequest.cs
  - SubmitQuoteRequest.cs
  - etc.
```

### Key .NET Libraries
- **Oracle.ManagedDataAccess.Core** - For Oracle database connectivity
- **Microsoft.AspNetCore.Authentication.JwtBearer** - For JWT authentication
- **AutoMapper** - For object mapping
- **FluentValidation** - For request validation

---

## SUMMARY

This API documentation covers:
- **31 endpoints** across 3 user roles
- **Common response structure** with success/message fields
- **Complete validation rules** for all inputs
- **Oracle stored procedure mappings** for database operations
- **Database schema** for all required tables
- **Implementation guidance** for .NET APIs

All APIs follow RESTful conventions and include proper error handling with standardized response formats.
