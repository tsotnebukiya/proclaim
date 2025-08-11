# Proclaim: Interbank Claims Settlement Solution on Blockchain

## Executive Summary

Proclaim is a comprehensive blockchain-based interbank claims settlement solution designed to streamline and automate the settlement of corporate action claims between financial institutions. The project consists of smart contracts deployed on an Ethereum-style test blockchain and web applications for three major financial institutions: Goldman Sachs, JPMorgan, and Citibank.

## Project Architecture

### High-Level Overview

The Proclaim ecosystem consists of:

1. **Smart Contracts Layer**: Deployed on a test blockchain for handling claim settlement logic
2. **ProclaimeHub**: Central coordination service for generating and distributing claims
3. **ProclaimeApp**: Bank-specific applications (3 instances) for claim management and settlement
4. **Shared Libraries**: Common functionality for blockchain interactions and utilities

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: tRPC, Prisma ORM, PostgreSQL, NextAuth.js
- **Blockchain**: Ethereum-compatible test network, Thirdweb SDK, Ethers.js
- **Infrastructure**: Turbo monorepo, pnpm workspace, Vercel deployment

## Smart Contracts Architecture

### Core Contracts

#### 1. BankContract.sol (`ClaimsContract`)

**Purpose**: Main contract for managing claims between banks

**Key Features**:

- Claim creation and management
- Settlement processing with token transfers
- Multi-currency support (USDt, EURt)
- Batch settlement operations
- Comprehensive error handling

**Core Functions**:

```solidity
// Claim Management
function addClaim(bytes32 claimIdentifier, string memory encryptedClaimData,
                 uint256 amountOwed, address counterpartyAddress, string memory tokenName)

function addClaims(bytes32[] memory claimIdentifiers, string[] memory encryptedClaimDatas,
                  uint256[] memory amountsOwed, address[] memory counterpartyAddresses,
                  string[] memory tokenNames)

// Settlement Operations
function settleClaim(bytes32 claimIdentifier)
function settleClaims(bytes32[] calldata claimIdentifiers)

// Query Functions
function getClaims() returns (bytes32[] memory ids, string[] memory encryptedData,
                            uint256[] memory amounts, bool[] memory settledStatus,
                            address[] memory counterparties, string[] memory tokenNames)

function getSettledClaims() // Returns only settled claims
function getUnsettledClaims() // Returns only unsettled claims
function getClaim(bytes32 claimIdentifier) // Returns specific claim details
```

**Security Features**:

- Owner-only claim creation
- Counterparty-only settlement authorization
- Token approval verification
- Balance validation before transfers
- Comprehensive event logging

#### 2. BankDepository.sol

**Purpose**: Central registry for bank registration and token management

**Key Features**:

- Bank registration with market and account details
- Token address management (USDt, EURt)
- Public key storage for encryption
- Contract address tracking

**Core Functions**:

```solidity
function registerBank(string memory market, uint accountNumber, address ethAddress,
                     address contractAddress, string memory publicKey, string memory teamName)

function getBankDetails(string memory market, uint accountNumber) returns (BankDetails memory)
function getAllBankDetails() returns (BankDetails[] memory)
function getTokenAddress(string memory tokenName) returns (address)
```

#### 3. Stablecoin.sol (`StableCoin`)

**Purpose**: ERC20-compatible stablecoin implementation for settlements

**Key Features**:

- Standard ERC20 functionality with custom approval system
- Mint capability for testing scenarios
- Decimal precision of 2 (representing cents)
- Owner-controlled minting

**Core Functions**:

```solidity
function transfer(address recipient, uint256 amount) returns (bool)
function transferFrom(address sender, address recipient, uint256 amount) returns (bool)
function approve(address spender) returns (bool)
function disapprove(address spender) returns (bool)
function mint(address recipient, uint256 amount) // Owner only
```

## Application Architecture

### Monorepo Structure

```
proclaim/
├── apps/
│   ├── proclaimhub/          # Central hub for claim generation
│   └── proclaimapp/          # Bank-specific applications
├── packages/
│   ├── proclaim/             # Smart contract interactions
│   └── typescript-config/    # Shared TypeScript config
└── Configuration files
```

### ProclaimeHub Application

**Purpose**: Central service for generating dummy claims and distributing them to bank instances

**Key Features**:

- Automated claim generation with realistic data
- Multi-market support (ICSD, US)
- Token minting for simulation scenarios
- API endpoints for claim distribution

**Core Endpoints**:

- `GET /api/generateclaims`: Generates and distributes claims to all banks
- `POST /api/minttoken`: Mints tokens for testing purposes

**Claim Generation Logic**:

- Creates matching claims between all bank pairs
- Supports both Interest Payment and Redemption corporate actions
- Generates claims for both ICSD and US markets
- Includes realistic settlement dates and amounts
- Distributes claims via API calls to bank instances

### ProclaimeApp (Bank Applications)

**Purpose**: Individual bank interfaces for claim management and settlement

**Multi-Instance Deployment**:

- **Citibank**: Port 3001, dedicated database
- **JPMorgan**: Port 3002, dedicated database
- **Goldman Sachs**: Port 3003, dedicated database

#### Database Schema

**Core Tables**:

```sql
-- Claims management
Table: Claim
- Basic claim information (trade reference, amounts, dates)
- Corporate action details (type, ID, event rate)
- Settlement status and transaction tracking
- Relationship to counterparty and team
- Encrypted claim data for privacy

-- Bank/Team management
Table: Team
- Bank identification (market, account, contract address)
- STP (Straight Through Processing) settings
- Team name and slug for routing

-- Audit and Error Tracking
Table: BlockchainError
- Settlement error logging
- Transaction hash tracking
- Error categorization and timestamps

-- Token Management
Table: TokenRequest
- Token minting requests
- Transaction tracking for funding

-- System Events
Table: GlobalEvents
- System-wide event logging
- Claim processing statistics
- Team-specific event tracking
```

#### User Interface Components

**Dashboard Features**:

- Real-time claim statistics
- Settlement status overview
- Corporate action summaries
- Token balance monitoring

**Claims Management**:

- Comprehensive claims table with filtering
- Individual claim detail views
- Bulk settlement operations
- Upload functionality for claim data
- Counterparty claim reconciliation

**Settlement Processing**:

- Interactive settlement interface
- Transaction status tracking
- Error handling and retry mechanisms
- Settlement confirmation workflows

## Blockchain Integration

### Network Configuration

**Test Blockchain Setup**:

- Custom Ethereum-compatible test network
- Configurable chain ID and RPC endpoints
- Private key management for each bank
- Contract deployment automation

### Smart Contract Deployment

**Deployment Process**:

1. Deploy BankDepository with token addresses
2. Deploy individual BankContract instances for each bank
3. Register banks in the depository
4. Configure token contracts and permissions

**Configuration Management**:

- Environment-specific settings
- Contract address tracking
- Private key security
- API endpoint configuration

### Transaction Processing

**Settlement Flow**:

1. Claims uploaded to database
2. Claims encrypted and hashed for blockchain
3. Claims added to smart contract via `addClaims`
4. Counterparty initiates settlement via `settleClaim`
5. Token transfer executed automatically
6. Settlement status updated in database

**Error Handling**:

- Insufficient balance detection
- Approval requirement validation
- Transaction failure recovery
- Comprehensive error logging

## Security and Privacy

### Data Encryption

**Claim Data Protection**:

- Sensitive claim data encrypted before blockchain storage
- Public key infrastructure for counterparty communication
- Hash-based claim identification
- Privacy-preserving settlement verification

### Access Control

**Smart Contract Security**:

- Owner-only claim creation
- Counterparty-only settlement authorization
- Contract address validation
- Reentrancy protection

**Application Security**:

- NextAuth.js authentication
- Role-based access control
- API endpoint protection
- Database access restrictions

## Multi-Currency Support

### Supported Currencies

**Primary Tokens**:

- **USDt**: US Dollar Tether equivalent (2 decimal precision)
- **EURt**: Euro Tether equivalent (2 decimal precision)

**Token Management**:

- Centralized token address registry
- Multi-currency settlement support
- Balance validation per currency
- Automated currency conversion tracking

## Development and Deployment

### Development Workflow

**Local Development**:

```bash
# Install dependencies
pnpm install

# Start all bank applications
pnpm dev

# Start individual bank instances
pnpm dev:citi    # Port 3001
pnpm dev:jp      # Port 3002
pnpm dev:goldman # Port 3003

# Database management
pnpm dbPush      # Push schema to all databases
pnpm dbReset     # Reset all databases
pnpm studio      # Open Prisma Studio for all banks
```

**Smart Contract Deployment**:

```bash
# Generate contract bindings
pnpm generate

# Deploy contracts to blockchain
pnpm deploy
```

### Environment Configuration

**Required Environment Variables**:

- `DATABASE_URL`: PostgreSQL connection strings (per bank)
- `PROCHAIN_*`: Blockchain network configuration
- `THIRDWEB_*`: Thirdweb SDK credentials
- `NEXTAUTH_*`: Authentication configuration
- `*_API`: Inter-service communication endpoints

### Database Setup

**Multi-Database Architecture**:

- Separate PostgreSQL database per bank
- Identical schema across all instances
- Environment-specific connection strings
- Automated migration and seeding

## API Architecture

### tRPC Backend

**Router Structure**:

- **Claims Router**: Claim CRUD operations, settlement processing
- **Dashboard Router**: Statistics and overview data
- **Teams Router**: Bank management and configuration
- **Contracts Router**: Smart contract interaction
- **Funding Router**: Token management and minting

**Key Endpoints**:

```typescript
// Claims Management
workspace.claims.getClaims({ workspace: string })
workspace.claims.getClaim({ tradeRef: string, workspace: string })
workspace.claims.settleClaims({ claimIds: number[], workspace: string })
workspace.claims.attachHash({ claimId: number, hash: string, workspace: string })

// Dashboard Data
workspace.dashboard.getStats({ workspace: string })
workspace.dashboard.getRecentActivity({ workspace: string })

// Contract Interactions
contracts.getBalance({ currency: string })
contracts.settleOnChain({ claims: ClaimData[], workspace: string })
```

### External API Integration

**Hub-to-Bank Communication**:

- RESTful API endpoints for claim distribution
- JSON payload with claim arrays
- Authentication via API keys
- Error handling and retry logic

## Business Logic

### Corporate Actions Support

**Supported Event Types**:

- **Interest Payments**: Periodic interest distributions
- **Redemptions**: Principal repayments and bond maturities
- **Dividends**: Equity dividend distributions
- **Mandatory Corporate Actions**: Required shareholder actions

**Claim Types**:

- **Payable**: Bank owes money to counterparty
- **Receivable**: Bank expects payment from counterparty

### Settlement Processing

**Settlement States**:

1. **Created**: Claim exists in database
2. **Uploaded**: Claim data uploaded to blockchain
3. **Matched**: Counterparty claim identified
4. **Settled**: Payment executed and confirmed
5. **Failed**: Settlement attempt failed with error

**Automated Processing**:

- STP (Straight Through Processing) support
- Batch settlement capabilities
- Exception handling workflows
- Reconciliation processes

## Monitoring and Analytics

### Dashboard Metrics

**Key Performance Indicators**:

- Total claims processed
- Settlement success rates
- Average settlement time
- Outstanding claim amounts
- Error rates by category

**Real-Time Monitoring**:

- Active claim counts
- Settlement queue status
- Blockchain transaction monitoring
- System health indicators

### Error Tracking

**Comprehensive Logging**:

- Blockchain settlement errors
- API communication failures
- Database operation logs
- User action audit trails

## Testing and Quality Assurance

### Test Data Generation

**Realistic Claim Generation**:

- Market-specific account structures
- Randomized but realistic amounts
- Proper settlement date calculations
- Cross-bank claim relationships

**Testing Scenarios**:

- Happy path settlements
- Insufficient balance handling
- Network failure recovery
- Concurrent settlement processing

## Future Enhancements

### Planned Features

**Advanced Settlement**:

- Netting calculations
- Multi-hop settlement chains
- Collateral management
- Real-time settlement notifications

**Enhanced Privacy**:

- Zero-knowledge proof integration
- Advanced encryption protocols
- Selective disclosure mechanisms
- Confidential transaction amounts

**Scalability Improvements**:

- Layer 2 integration
- Batch settlement optimization
- Cross-chain settlement support
- Performance monitoring tools

## Conclusion

Proclaim represents a comprehensive solution for modernizing interbank claims settlement through blockchain technology. The system successfully demonstrates how distributed ledger technology can improve transparency, reduce settlement times, and minimize operational risks in financial markets.

The multi-application architecture allows each bank to maintain operational independence while participating in a shared settlement network. Smart contracts ensure settlement finality and reduce counterparty risk, while the user-friendly interfaces enable efficient claim management and processing.

The project serves as a proof-of-concept for how traditional financial infrastructure can be enhanced through blockchain technology while maintaining the security, compliance, and operational requirements of major financial institutions.
