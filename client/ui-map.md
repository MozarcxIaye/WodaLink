# WodaLink UI Map

Version 1.0

---

# Purpose

This document defines every user-facing screen in the WodaLink frontend.

It serves as the implementation blueprint for developers and AI code generators.

Every page includes:

- Route
- Purpose
- Components
- API Dependencies
- User Actions
- Navigation Flow

The backend remains the source of truth.

---

# Application Structure

Landing

├── Home

├── About

├── Become Runner

├── FAQ

├── Login

└── Register

Expat Portal

├── Dashboard

├── Create Request

├── My Requests

├── Request Detail

├── Profile

└── Settings

Runner Portal

├── Dashboard

├── Open Jobs

├── My Jobs

├── Job Detail

├── Completed Jobs

├── Profile

└── Settings

Admin Portal

├── Dashboard

├── Users

├── User Detail

├── Runners

├── Runner Detail

├── Requests

├── Request Detail

├── Statistics

├── Payments

└── Settings

Landing Pages
/

Purpose

Landing page

Components

Navbar

Hero

How It Works

Features

Why WodaLink

FAQ

Footer

Actions

Login

Register

Become Runner
/login

Components

Login Form

Logo

Theme Toggle

API

POST /identity/login

Success

↓

Fetch User

↓

Redirect by role
/register

Components

Register Form

Role Selector

Municipality Selector

Password Strength

API

POST /identity/register
Expat Portal
/expat/dashboard

Components

Sidebar

Top Navbar

Welcome Card

Statistics Cards

Recent Requests

Current Active Request

Quick Actions

API

GET /expat/profile

GET /procurement
/expat/requests

Components

Page Header

Search Bar

Filter Bar

Request Table

Pagination

Actions

View

Cancel

Search

Filter
/expat/requests/new

Components

CreateRequestForm

Municipality Select

Document Type Select

Notes Textarea

Submit Button

API

POST /procurement
/expat/requests/:id

Components

Timeline

Request Card

Runner Card

Activity Timeline

Upload Preview

Status Badge

Actions

Cancel Request

Download Scan
/expat/profile

Components

Profile Card

Edit Form

Save Button

API

GET /expat/profile

PATCH /users/profile
Runner Portal
/runner/dashboard

Components

Statistics Cards

Availability Toggle

Recent Activity

Current Jobs
/runner/jobs

Components

Search

Filters

Jobs Table

Pagination

API

GET /marketplace/open-jobs

Actions

Claim Job
/runner/jobs/:id

Components

Timeline

Request Details

Upload Card

Status Card

Activity Timeline

Actions

Start Procurement

Upload Scan
/runner/history

Components

Completed Table

Statistics

Filters
/runner/profile

Components

Runner Card

Availability

Verification Badge

Edit Profile
Admin Portal
/admin/dashboard

Components

Statistics Cards

Charts

Recent Activity

Pending Actions

API

GET /admin/statistics
/admin/users

Components

Users Table

Search

Filters

Pagination

Actions

View

Suspend

Verify
/admin/users/:id

Components

User Card

History

Activity

Requests

Profile
/admin/runners

Components

Runner Table

Availability

Verification Badge

Actions

View

Verify

Suspend
/admin/runners/:id

Components

Runner Statistics

History

Current Jobs

Completed Jobs

Verification
/admin/requests

Components

Request Table

Search

Filters

Timeline

Actions
/admin/requests/:id

Components

Timeline

Request Details

Runner Details

Activity Timeline

Document Preview
/admin/statistics

Components

Line Chart

Bar Chart

Pie Chart

Stat Cards
/admin/payments

Components

Payment Table

Status Badge

Filters
Shared Dialogs

Confirm Dialog

Delete Dialog

Claim Job Dialog

Cancel Request Dialog

Upload Scan Dialog

Verify Runner Dialog

Suspend User Dialog

Edit Profile Dialog

Shared Drawers

Mobile Navigation

Filter Drawer

Profile Drawer

Notification Drawer (Future)

Shared Tables

Users

Requests

Jobs

Payments

Statistics

Every table uses

DataTable

Shared Cards

Welcome Card

Statistic Card

Profile Card

Request Card

Runner Card

Payment Card

Activity Card

Empty Card

Shared Navigation

Desktop Sidebar

Mobile Drawer

Top Navbar

Breadcrumbs

Footer

Shared Forms

Login

Register

Create Request

Edit Profile

Upload Scan

Availability

Shared Components

Timeline

Status Badge

Avatar

Search

Filter

Pagination

Skeleton

Empty State

Error State

Loading State

Toast

Responsive Behaviour

Desktop

Sidebar

Large Tables

Tablet

Collapsed Sidebar

Adaptive Cards

Mobile

Drawer Navigation

Cards instead of Tables

Sticky Actions

Bottom Padding

User Flow

Expat

Landing

↓

Register

↓

Login

↓

Dashboard

↓

Create Request

↓

Track Progress

↓

Download Scan

↓

Logout

Runner

Login

↓

Dashboard

↓

Open Jobs

↓

Claim Job

↓

Start Procurement

↓

Upload Scan

↓

Complete

↓

Logout

Admin

Login

↓

Dashboard

↓

Monitor

↓

Verify Runner

↓

Manage Requests

↓

Statistics

↓

Logout
Screen Count

Landing

6 Screens

Expat

6 Screens

Runner

6 Screens

Admin

8 Screens

Shared

12 Components

Approximately

26–30 Screens

Ready for implementation.


---

# ✅ My recommendation (important)

After seeing your backend, I would make **one improvement** to this UI map before we even touch Antigravity.

Instead of thinking in terms of **pages**, think in terms of **features**.

For example:

```text
Request Management
├── RequestTable
├── RequestCard
├── RequestTimeline
├── RequestStatusBadge
├── RequestDetails
└── RequestActions

Then reuse those components across:

Expat
Runner
Admin

The same goes for:

User Management
Runner Management
Profile Management
Statistics
Authentication