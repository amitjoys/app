# InsightsSnap Backend Implementation Contracts

## API Contracts

### Authentication APIs

#### POST /api/auth/register
- **Request**: `{ name: string, email: string, password: string }`
- **Response**: `{ token: string, user: { id, email, name, role, plan } }`
- Creates new user with Free plan by default

#### POST /api/auth/login
- **Request**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id, email, name, role, plan } }`
- Returns JWT token for authentication

#### GET /api/auth/me
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ user: { id, email, name, role, plan, credits } }`
- Gets current user profile

### User APIs

#### GET /api/users/credits
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ searchesRemaining, aiGenerationsRemaining, exportsRemaining, searchesUsedToday, aiGenerationsUsedToday, exportsUsedThisMonth }`
- Gets user's current credit balance

#### POST /api/users/upgrade
- **Request**: `{ planId: string }`
- **Response**: `{ success: boolean, plan: string }`
- Upgrades user to a new plan (mock payment for now)

### Insights APIs

#### POST /api/insights/search
- **Headers**: `Authorization: Bearer {token}`
- **Request**: `{ query: string }`
- **Response**: `{ painPoints: [...], trendingIdeas: [...], contentIdeas: [...] }`
- Searches for insights based on query (returns mock data initially)
- Deducts 1 search credit from user

#### POST /api/insights/export
- **Headers**: `Authorization: Bearer {token}`
- **Request**: `{ insightId: string, format: 'CSV' | 'PDF' }`
- **Response**: `{ downloadUrl: string }`
- Exports insights to CSV/PDF (returns mock URL initially)
- Deducts 1 export credit from user

### Pricing APIs

#### GET /api/pricing/plans
- **Response**: `[{ id, name, description, price, billing, features, searchesPerDay, aiGenerations, exportsPerMonth, resultsPerCategory, isPopular }]`
- Gets all pricing plans

### SuperAdmin APIs

#### POST /api/admin/auth/login
- **Request**: `{ username: string, password: string }`
- **Response**: `{ token: string, admin: { id, username, role } }`
- Admin login with JWT

#### GET /api/admin/pricing
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**: `[{ pricing plans }]`
- Gets all pricing plans for admin

#### POST /api/admin/pricing
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request**: `{ name, description, price, billing, features, searchesPerDay, aiGenerations, exportsPerMonth, resultsPerCategory, isPopular }`
- **Response**: `{ plan: {...} }`
- Creates new pricing plan

#### PUT /api/admin/pricing/:id
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request**: `{ plan data }`
- **Response**: `{ plan: {...} }`
- Updates existing pricing plan

#### DELETE /api/admin/pricing/:id
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**: `{ success: boolean }`
- Deletes pricing plan

#### GET /api/admin/payment-settings
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**: `{ razorpay: { enabled, keyId }, paypal: { enabled, clientId } }`
- Gets payment gateway settings

#### PUT /api/admin/payment-settings
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request**: `{ gateway: 'razorpay' | 'paypal', enabled: boolean, credentials: {...} }`
- **Response**: `{ success: boolean }`
- Updates payment gateway settings

#### GET /api/admin/seo-settings
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**: `[{ page, title, description, keywords, canonical, ogImage }]`
- Gets SEO settings for all pages

#### PUT /api/admin/seo-settings/:page
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request**: `{ title, description, keywords, canonical, ogImage }`
- **Response**: `{ seo: {...} }`
- Updates SEO settings for specific page

#### GET /api/admin/users
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**: `[{ users with stats }]`
- Gets all users with usage stats

#### PUT /api/admin/users/:id/credits
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request**: `{ credits: { searchesRemaining, aiGenerationsRemaining, exportsRemaining } }`
- **Response**: `{ user: {...} }`
- Manually adjust user credits

## Mock Data to Replace

### Frontend Files:
- `/app/frontend/src/mock.js`:
  - `mockPricingPlans` → Replace with API call to `/api/pricing/plans`
  - `mockTestimonials` → Keep as frontend data (not stored in DB)
  - `mockInsights` → Replace with API call to `/api/insights/search`
  - `mockUserData` → Replace with API calls to `/api/auth/me` and `/api/users/credits`

### Pages to Update:
1. **Login.jsx**: 
   - Replace mock login with POST `/api/auth/login`
   
2. **Signup.jsx**: 
   - Replace mock signup with POST `/api/auth/register`
   
3. **Dashboard.jsx**: 
   - Fetch user data from GET `/api/auth/me` and GET `/api/users/credits`
   - Replace mock search with POST `/api/insights/search`
   - Replace mock export with POST `/api/insights/export`
   
4. **Home.jsx** & **Pricing.jsx**: 
   - Replace `mockPricingPlans` with GET `/api/pricing/plans`

## Backend Implementation Plan

### Phase 1: Database Models
1. User model (email, password, name, role, plan, credits)
2. PricingPlan model
3. SearchHistory model (user, query, results, timestamp)
4. PaymentSettings model
5. SEOSettings model
6. Admin model

### Phase 2: Core APIs
1. Authentication (register, login, JWT middleware)
2. User management (profile, credits)
3. Pricing plans (CRUD)
4. Insights search (mock initially, then integrate real API)

### Phase 3: SuperAdmin Features
1. Admin authentication
2. Pricing plan management
3. Payment gateway settings
4. SEO/AEO/Canonical tags management
5. User management (view users, adjust credits)

### Phase 4: Frontend Integration
1. Create API service layer in frontend
2. Replace all mock data with real API calls
3. Add loading states and error handling
4. Implement protected routes with authentication

## Database Schema

### users
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  plan: String (Free/Standard/Pro),
  credits: {
    searchesRemaining: Number,
    aiGenerationsRemaining: Number,
    exportsRemaining: Number,
    searchesUsedToday: Number,
    aiGenerationsUsedToday: Number,
    exportsUsedThisMonth: Number,
    lastResetDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### pricing_plans
```
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  billing: String,
  trialInfo: String,
  features: [String],
  searchesPerDay: Number,
  aiGenerations: Number,
  exportsPerMonth: Number,
  resultsPerCategory: Number,
  isPopular: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### search_history
```
{
  _id: ObjectId,
  userId: ObjectId,
  query: String,
  results: {
    painPoints: Array,
    trendingIdeas: Array,
    contentIdeas: Array
  },
  timestamp: Date
}
```

### payment_settings
```
{
  _id: ObjectId,
  gateway: String (razorpay/paypal),
  enabled: Boolean,
  credentials: {
    // Encrypted credentials
    keyId: String,
    keySecret: String (encrypted)
  },
  updatedAt: Date
}
```

### seo_settings
```
{
  _id: ObjectId,
  page: String (home/pricing/blog/contact/dashboard),
  title: String,
  description: String,
  keywords: [String],
  canonical: String,
  ogImage: String,
  updatedAt: Date
}
```

## Notes
- All user passwords will be hashed using bcrypt
- JWT tokens expire in 7 days
- Credits reset daily for searches, monthly for exports
- Payment integration is mocked initially, user will add real credentials in .env
- SEO settings will be fetched on page load and injected into HTML head
