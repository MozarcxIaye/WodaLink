# api-mapping.md

Version 1.0

---

# Purpose

This document maps every backend endpoint to the frontend architecture.

For every endpoint define

- Service
- React Query Hook
- Query Key
- Used By
- Cache Strategy
- Invalidation
- Loading State
- Error State

The backend remains the only source of truth.

---

# Module Overview

Identity

Authentication

Profile

Users

Procurement

Document Requests

State Machine

Document Upload

Marketplace

Open Jobs

Runner Availability

Claim Request

Admin

Users

Runners

Statistics

Requests

---

# ============================
# IDENTITY MODULE
# ============================

------------------------------------------------

POST /identity/register

------------------------------------------------

Purpose

Create new account.

Service

auth.service.ts

register()

Hook

useRegister()

Mutation

Yes

Used By

Register Page

Success

Toast

↓

Redirect Login

Invalidate

None

Loading

Button Spinner

Error

Validation Card

------------------------------------------------

POST /identity/login

------------------------------------------------

Purpose

Authenticate user.

Service

login()

Hook

useLogin()

Mutation

Yes

Success

Store JWT

↓

Fetch Current User

↓

Redirect by Role

Used By

Login Page

Invalidate

currentUser

Loading

Button Spinner

Error

Authentication Error

------------------------------------------------

GET /identity/me

------------------------------------------------

Purpose

Retrieve authenticated user.

Service

me()

Hook

useCurrentUser()

Query Key

auth.currentUser

Used By

App

Navbar

Dashboard

Protected Routes

Profile

Cache

10 minutes

------------------------------------------------

POST /identity/logout

------------------------------------------------

Purpose

Logout

Service

logout()

Hook

useLogout()

Success

Clear Token

↓

Clear Cache

↓

Redirect Login

------------------------------------------------

POST /identity/verify-kyc

------------------------------------------------

Purpose

Submit runner verification.

Service

verifyKyc()

Hook

useVerifyKyc()

Invalidate

runner.profile

------------------------------------------------

PATCH /users/profile

------------------------------------------------

Purpose

Update profile.

Service

updateProfile()

Hook

useUpdateProfile()

Invalidate

auth.currentUser

runner.profile

expat.profile

---

# ============================
# PROCUREMENT MODULE
# ============================

------------------------------------------------

GET /procurement

------------------------------------------------

Purpose

List requests.

Service

getRequests()

Hook

useRequests()

Query Key

procurement.requests

Used By

Expat Dashboard

Admin Dashboard

Cache

2 minutes

------------------------------------------------

POST /procurement

------------------------------------------------

Purpose

Create procurement request.

Service

createRequest()

Hook

useCreateRequest()

Invalidate

procurement.requests

dashboard.statistics

Success

Redirect Request Detail

------------------------------------------------

GET /procurement/:id

------------------------------------------------

Purpose

Request detail.

Service

getRequest()

Hook

useRequest(id)

Query Key

procurement.request(id)

Cache

2 minutes

Used By

Expat

Runner

Admin

------------------------------------------------

PATCH /procurement/status

------------------------------------------------

Purpose

Update workflow status.

Service

updateStatus()

Hook

useUpdateStatus()

Invalidate

procurement.request

procurement.requests

runner.jobs

admin.requests

------------------------------------------------

PATCH /procurement/upload-scan

------------------------------------------------

Purpose

Upload completed scan.

Service

uploadScan()

Hook

useUploadScan()

Mutation

Multipart FormData

Invalidate

procurement.request

runner.jobs

admin.requests

------------------------------------------------

PATCH /procurement/cancel

------------------------------------------------

Purpose

Cancel request.

Service

cancelRequest()

Hook

useCancelRequest()

Invalidate

procurement.requests

dashboard.statistics

---

# ============================
# MARKETPLACE MODULE
# ============================

------------------------------------------------

GET /marketplace/open-jobs

------------------------------------------------

Purpose

Available jobs.

Service

getOpenJobs()

Hook

useOpenJobs()

Query Key

marketplace.openJobs

Cache

30 seconds

Used By

Runner Dashboard

------------------------------------------------

POST /marketplace/claim

------------------------------------------------

Purpose

Claim request.

Service

claimJob()

Hook

useClaimJob()

Invalidate

marketplace.openJobs

runner.jobs

admin.requests

------------------------------------------------

PATCH /marketplace/availability

------------------------------------------------

Purpose

Toggle runner availability.

Service

updateAvailability()

Hook

useAvailability()

Optimistic Update

Yes

Rollback

Yes

------------------------------------------------

GET /runner/jobs

------------------------------------------------

Purpose

Runner active jobs.

Service

getRunnerJobs()

Hook

useRunnerJobs()

Query Key

runner.jobs

Cache

1 minute

------------------------------------------------

GET /runner/profile

------------------------------------------------

Purpose

Runner profile.

Service

getRunnerProfile()

Hook

useRunnerProfile()

Query Key

runner.profile

---

# ============================
# ADMIN MODULE
# ============================

------------------------------------------------

GET /admin/dashboard

------------------------------------------------

Purpose

Dashboard overview.

Service

getDashboard()

Hook

useDashboard()

Cache

5 minutes

------------------------------------------------

GET /admin/users

------------------------------------------------

Purpose

List users.

Service

getUsers()

Hook

useUsers()

Query Key

admin.users

------------------------------------------------

GET /admin/runners

------------------------------------------------

Purpose

List runners.

Service

getRunners()

Hook

useRunners()

Query Key

admin.runners

------------------------------------------------

GET /admin/requests

------------------------------------------------

Purpose

List requests.

Service

getRequests()

Hook

useAdminRequests()

Query Key

admin.requests

------------------------------------------------

GET /admin/statistics

------------------------------------------------

Purpose

Dashboard statistics.

Service

getStatistics()

Hook

useStatistics()

Query Key

admin.statistics

Cache

5 minutes

---

# Query Keys

auth.currentUser

procurement.requests

procurement.request(id)

runner.jobs

runner.profile

marketplace.openJobs

admin.dashboard

admin.users

admin.runners

admin.requests

admin.statistics

---

# Cache Invalidation Matrix

Login

↓

currentUser

Create Request

↓

procurement.requests

dashboard.statistics

Update Profile

↓

currentUser

runner.profile

expat.profile

Claim Job

↓

runner.jobs

marketplace.openJobs

admin.requests

Upload Scan

↓

request

runner.jobs

admin.requests

Update Status

↓

request

requests

statistics

Cancel Request

↓

requests

statistics

Logout

↓

Clear Entire Cache

---

# API Error Mapping

401

Logout

Redirect Login

403

Unauthorized Page

404

Resource Not Found

409

Business Rule Error

422

Validation Error

500

Unexpected Error

Network

Connection Error

All errors should display user-friendly messages.

---

# Retry Strategy

GET

Retry once

POST

Never retry

PATCH

Never retry

DELETE

Never retry

---

# Toast Matrix

Register

Success

Login

Success

Profile Updated

Success

Request Created

Success

Job Claimed

Success

Upload Scan

Success

Availability Updated

Success

Validation Error

Error

Server Error

Error

Network Error

Warning

---

# File Upload Strategy

Multipart FormData

Preview

Progress Bar

File Validation

Retry

Cancel Upload

Future

Cloud Storage

Signed URL

---

# Service Layer Structure

services/

auth.service.ts

procurement.service.ts

marketplace.service.ts

admin.service.ts

No business logic.

HTTP only.

---

# Hook Layer

features/

auth/hooks/

procurement/hooks/

marketplace/hooks/

admin/hooks/

Hooks own

React Query

Loading

Caching

Invalidation

Optimistic Updates

---

# Definition of Done

Every endpoint must have

✓ Service

✓ Hook

✓ Types

✓ Loading State

✓ Error State

✓ Query Key

✓ Cache Strategy

✓ Invalidation

✓ Toast

✓ Fully Typed