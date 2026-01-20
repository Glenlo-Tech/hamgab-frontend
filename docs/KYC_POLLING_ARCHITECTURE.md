# KYC Status Polling Architecture - Complete Explanation

## 🏗️ Architecture Overview

The KYC status system uses **SWR (Stale-While-Revalidate)** - a React Hooks library for data fetching that provides:
- **Automatic caching** - Stores responses in memory
- **Request deduplication** - Prevents duplicate API calls
- **Automatic revalidation** - Refreshes data when needed
- **Polling support** - Checks for updates at intervals
- **Optimistic updates** - Instant UI updates

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION STARTUP                           │
│  (User opens dashboard/profile/listings page)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Component calls: useKYCStatus()                                │
│  - Dashboard, Profile, Listings, Layout components            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  SWR Hook Initialization                                        │
│  - Creates cache key: ["kyc", "status"]                         │
│  - Checks cache first (might have stale data)                    │
│  - Returns cached data immediately (if exists)                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Request Deduplication Check                                     │
│  - Checks if same request is already in-flight                   │
│  - If YES: Reuses existing promise (no duplicate API call)      │
│  - If NO: Proceeds to fetch                                      │
│  - Deduplication window: 2 seconds                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Call: GET /api/v1/kyc/status                               │
│  - Fetches from backend                                          │
│  - Includes auth token from localStorage                         │
│  - Returns: { status: "PENDING" | "APPROVED" | "REJECTED" }     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Response Handling                                               │
│  - Success: Cache response, update all components                │
│  - 404 Error: Return null (KYC not submitted yet)                │
│  - Other Errors: Retry up to 3 times                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Polling Decision                                                │
│  - If status === "PENDING": Start polling every 30 seconds      │
│  - If status === "APPROVED": Stop polling                        │
│  - If status === "REJECTED": Stop polling                       │
│  - If null (not submitted): Stop polling                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Component Updates                                               │
│  - All components using useKYCStatus() automatically update    │
│  - UI reflects current status                                    │
│  - Buttons enable/disable based on kycApproved flag             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Step-by-Step Process

### 1. **Initial Setup (App Load)**

```typescript
// apps/agent/app/layout.tsx
<SWRProvider>  {/* Wraps entire app */}
  {children}
</SWRProvider>
```

- **SWRProvider** wraps the entire app
- Provides global SWR configuration to all components
- Sets up default behaviors (deduplication, revalidation, etc.)

### 2. **Component Calls Hook**

```typescript
// Any component (Dashboard, Profile, Listings, Layout)
const { kycStatus, kycApproved, isLoading } = useKYCStatus()
```

**What happens:**
- Component requests KYC status
- SWR checks its internal cache for key `["kyc", "status"]`
- If cached data exists → returns immediately (stale data)
- If no cache → returns `isLoading: true`

### 3. **SWR Configuration (swr-config.ts)**

```typescript
{
  dedupingInterval: 2000,        // Prevent duplicate requests within 2 seconds
  revalidateOnFocus: true,        // Refresh when user switches back to tab
  revalidateOnReconnect: true,    // Refresh when internet reconnects
  errorRetryCount: 3,             // Retry failed requests 3 times
  errorRetryInterval: 5000,       // Wait 5 seconds between retries
}
```

**Key Features:**
- **Deduplication**: If 5 components call `useKYCStatus()` at the same time, only 1 API call is made
- **Focus Revalidation**: When user switches tabs and comes back, data refreshes
- **Error Handling**: Automatically retries on network errors

### 4. **Fetcher Function (use-kyc-status.ts)**

```typescript
async function kycStatusFetcher(): Promise<KYCSubmissionResponse | null> {
  try {
    const status = await getKYCStatus()  // API call
    return status
  } catch (error) {
    if (error.status === 404) {
      return null  // KYC not submitted yet - not an error
    }
    throw error  // Real error - SWR will retry
  }
}
```

**What it does:**
- Makes the actual API call to `/api/v1/kyc/status`
- Handles 404 gracefully (user hasn't submitted KYC yet)
- Throws other errors for SWR to handle (retry logic)

### 5. **Polling Logic (The Smart Part)**

```typescript
refreshInterval: (data) => {
  // If status is PENDING, poll every 30 seconds
  return data?.status === "PENDING" ? 30000 : 0
}
```

**How it works:**
- **Dynamic polling**: Only polls when status is "PENDING"
- **Stops automatically**: When status changes to "APPROVED" or "REJECTED"
- **Efficient**: No unnecessary API calls when status is final

**Timeline Example:**
```
00:00 - User submits KYC → Status: PENDING
00:00 - Polling starts (every 30 seconds)
00:30 - Poll #1 → Still PENDING
01:00 - Poll #2 → Still PENDING
01:30 - Poll #3 → Status: APPROVED ✅
01:30 - Polling stops automatically
```

### 6. **Request Deduplication**

**Scenario:** User opens Dashboard, Profile, and Listings pages simultaneously.

**Without SWR:**
```
Dashboard → API Call #1
Profile   → API Call #2  ❌ Duplicate!
Listings  → API Call #3  ❌ Duplicate!
```

**With SWR:**
```
Dashboard → API Call #1
Profile   → Reuses Call #1 ✅
Listings  → Reuses Call #1 ✅
```

**How it works:**
- SWR tracks in-flight requests by cache key
- If same key is requested within 2 seconds, reuses the promise
- All components get the same data when request completes

### 7. **Caching Strategy**

**Cache Key:** `["kyc", "status"]`

**Cache Behavior:**
- **Stale-While-Revalidate**: Shows old data immediately, fetches fresh data in background
- **Shared Cache**: All components share the same cache
- **Automatic Invalidation**: Cache updates when new data arrives

**Example:**
```
1. Dashboard loads → Fetches KYC status → Caches it
2. User navigates to Profile → Uses cached data (instant) → Revalidates in background
3. User navigates to Listings → Uses cached data (instant) → Revalidates in background
```

### 8. **Component Updates**

**When status changes:**
- All components using `useKYCStatus()` automatically re-render
- UI updates reflect new status
- No manual refresh needed

**Example:**
```typescript
// Dashboard component
const { kycApproved } = useKYCStatus()

// Button automatically enables/disables
<Button disabled={!kycApproved}>
  Submit Property
</Button>
```

---

## 🎯 Real-World Scenarios

### Scenario 1: User Submits KYC

```
1. User fills form → Clicks "Submit"
2. API call: POST /api/v1/kyc/submit
3. Success → mutate() called to refresh cache
4. SWR immediately fetches new status
5. Status: PENDING → Polling starts automatically
6. UI updates: Shows "Pending" badge, disables buttons
```

### Scenario 2: Admin Approves KYC

```
1. Admin approves in backend
2. User has dashboard open (polling every 30s)
3. Next poll (within 30s) → Status: APPROVED
4. Polling stops automatically
5. All components update:
   - Dashboard: KYC card disappears
   - Listings: "New Listing" button enables
   - Profile: Shows "Approved" badge
   - Layout: Mobile nav "Submit" button enables
```

### Scenario 3: Multiple Tabs Open

```
1. User has Dashboard open in Tab 1
2. User opens Profile in Tab 2
3. Both tabs use same SWR cache
4. When Tab 1 polls and gets update
5. Tab 2 automatically gets update (via SWR's global state)
6. Both tabs stay in sync
```

### Scenario 4: User Switches Tabs

```
1. User on Dashboard → Polling active
2. User switches to another app (tab loses focus)
3. User comes back after 2 minutes
4. SWR's revalidateOnFocus triggers
5. Immediately fetches fresh status
6. UI updates if status changed
```

---

## 🔧 Key Components

### 1. **SWRProvider** (apps/agent/components/providers/swr-provider.tsx)
- Wraps entire app
- Provides global SWR configuration
- Enables shared cache across components

### 2. **useKYCStatus Hook** (apps/agent/hooks/use-kyc-status.ts)
- Custom hook wrapping SWR
- Provides clean API for components
- Handles polling logic
- Returns: `{ kycStatus, kycApproved, isLoading, mutate }`

### 3. **swr-config.ts** (apps/agent/lib/swr-config.ts)
- Centralized SWR configuration
- Defines cache keys
- Sets retry and deduplication rules

### 4. **auth.ts** (apps/agent/lib/auth.ts)
- `getKYCStatus()` - Makes API call
- `submitKYC()` - Submits KYC documents
- `isKYCApproved()` - Helper function

### 5. **api-client.ts** (apps/agent/lib/api-client.ts)
- Handles HTTP requests
- Adds auth tokens
- Error handling
- Response parsing

---

## 📈 Performance Benefits

### 1. **Reduced API Calls**
- Without SWR: Every component = separate API call
- With SWR: Multiple components = 1 API call (deduplication)

### 2. **Instant UI Updates**
- Cached data shows immediately
- Fresh data loads in background
- No loading spinners for cached data

### 3. **Automatic Polling**
- Only polls when needed (PENDING status)
- Stops automatically when done
- No manual cleanup required

### 4. **Error Resilience**
- Automatic retries on failures
- Graceful error handling
- 404 handled as "not submitted" (not error)

---

## 🎨 UI Integration Points

### Components Using KYC Status:

1. **Dashboard** (`agent-dashboard.tsx`)
   - Shows KYC status card
   - Disables "Submit Property" button
   - Auto-dismisses card when approved

2. **Profile** (`agent-profile.tsx`)
   - Shows KYC form (if not approved)
   - Shows status badge
   - Refreshes status after submission

3. **Listings** (`agent-listings.tsx`)
   - Disables "New Listing" button
   - Shows tooltip explaining why disabled

4. **Layout** (`agent-layout.tsx`)
   - Disables mobile nav "Submit" button
   - Shows agent status in sidebar

---

## 🔍 Debugging Tips

### Check SWR Cache:
```typescript
// In browser console
window.__SWR_DEVTOOLS__ // If SWR DevTools installed
```

### Monitor API Calls:
- Open Network tab in DevTools
- Filter by `/api/v1/kyc/status`
- See polling frequency (should be every 30s when PENDING)

### Check Component State:
```typescript
const { kycStatus, kycApproved, isLoading } = useKYCStatus()
console.log({ kycStatus, kycApproved, isLoading })
```

---

## 🚀 Summary

**The architecture provides:**
1. ✅ **Automatic polling** - Checks status every 30s when PENDING
2. ✅ **Request deduplication** - Multiple components = 1 API call
3. ✅ **Smart caching** - Instant UI updates with stale-while-revalidate
4. ✅ **Automatic cleanup** - Polling stops when status is final
5. ✅ **Global state** - All components stay in sync
6. ✅ **Error resilience** - Automatic retries and graceful handling
7. ✅ **Performance** - Minimal API calls, maximum efficiency

**The result:** A seamless, real-time KYC status system that updates automatically without manual refreshes or complex state management.

