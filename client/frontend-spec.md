# WodaLink Frontend Specification

Version: 1.0

---

# Overview

WodaLink is a procurement marketplace connecting Nepali citizens living abroad (Expats) with verified local runners in Nepal who can physically obtain official government documents from municipalities, ward offices, and government agencies.

Unlike a traditional e-commerce marketplace, WodaLink revolves around workflow management, document procurement, trust, and status transparency.

The frontend should present a modern SaaS experience that feels professional, trustworthy, and intuitive for users with varying levels of technical expertise.

The backend is considered the single source of truth. The frontend must never invent APIs or business logic.

---

# Product Goals

The primary objective of the frontend is to reduce complexity for users while exposing the full procurement lifecycle in a simple and understandable manner.

The application should allow:

• Expats to request documents with confidence.

• Runners to discover and complete jobs efficiently.

• Administrators to monitor and manage the entire platform.

The experience should prioritize clarity over feature density.

---

# Design Philosophy

The frontend should resemble modern SaaS applications rather than traditional government systems.

Design inspiration:

• Linear

• Stripe Dashboard

• Clerk

• Vercel Dashboard

• Notion

Avoid:

❌ Bootstrap appearance

❌ Material Design overload

❌ Government portal styling

❌ Excessive gradients

❌ Heavy skeuomorphism

The interface should emphasize whitespace, typography, subtle shadows, and clear hierarchy.

---

# Target Users

There are three primary roles.

## Expat

Primary goals:

• Create procurement requests

• Upload required documents

• Track request progress

• View completed requests

• Manage profile

Pain points:

• Uncertainty regarding request status

• Lack of trust

• Time zone differences

The UI should emphasize transparency and progress tracking.

---

## Runner

Primary goals:

• Find nearby procurement jobs

• Claim available requests

• Update procurement progress

• Upload completed scans

• Track work history

The runner interface should optimize efficiency and minimize unnecessary navigation.

---

## Administrator

Primary goals:

• Monitor platform activity

• Verify runners

• Review procurement requests

• Manage users

• Monitor statistics

The admin dashboard should prioritize information density without sacrificing readability.

---

# Product Principles

The frontend should follow five principles.

1.

Simple.

Users should never feel overwhelmed.

2.

Fast.

Every interaction should feel immediate.

3.

Transparent.

Every procurement request clearly communicates its current state.

4.

Trustworthy.

The interface should reinforce credibility through consistency and professionalism.

5.

Accessible.

The application must remain usable across desktop, tablet, and mobile devices.

---

# Technology Stack

Framework

React 19

Bundler

Vite

Language

TypeScript

Styling

TailwindCSS v4

UI Library

shadcn/ui

Icons

Lucide React

Routing

React Router v7

Server State

TanStack Query

Forms

React Hook Form

Validation

Zod

HTTP Client

Axios

Charts

Recharts

Notifications

Sonner

Animations

Framer Motion

Authentication

JWT Bearer Token

---

# Folder Structure

src/

api/

components/

features/

hooks/

layouts/

lib/

providers/

router/

services/

types/

utils/

styles/

Within features/

auth/

expat/

runner/

admin/

procurement/

marketplace/

Each feature owns:

components/

pages/

hooks/

services/

types/

No feature should directly access another feature's internal implementation.

---

# Architecture Philosophy

The frontend follows Feature First Architecture.

Every business domain is isolated.

Example

Identity

↓

Authentication Pages

↓

Authentication Hooks

↓

Authentication Services

↓

Authentication Components

The frontend mirrors the backend modules.

This minimizes coupling and improves maintainability.

---

# Role Based Routing

Routes should be protected using role guards.

Guest

/

/login

/register

/about

Expat

/expat/*

Runner

/runner/*

Admin

/admin/*

Unauthorized access automatically redirects to the appropriate dashboard.

---

# Authentication Flow

User Login

↓

Receive JWT

↓

Store Access Token

↓

Fetch Current User

↓

Determine Role

↓

Redirect

↓

Persist Session

↓

Refresh User Information

The frontend should never infer user permissions from UI state.

Permissions are determined exclusively by the authenticated user's role.

---

# Request Lifecycle Visualization

Every procurement request should visually display its current position within the procurement workflow.

Pending

↓

Assigned

↓

In Progress

↓

Completed

Cancelled

Terminal

Instead of text badges, use a horizontal progress timeline.

This visualization should appear on every request detail page.

# Chapter 2 — Design System

---

# Design Philosophy

The WodaLink frontend follows a modern SaaS design language inspired by:

- Linear
- Vercel Dashboard
- Stripe Dashboard
- Notion
- Clerk

The application should prioritize simplicity, consistency, readability, and professionalism over decorative visuals.

The interface should feel lightweight while conveying trust, reliability, and efficiency.

Avoid excessive gradients, oversized illustrations, glassmorphism, and distracting animations.

---

# Theme

Support both Light and Dark themes.

Dark mode should be the default experience.

Users may toggle between themes, and the preference should persist locally.

---

# Color System

## Primary

Purpose:
Brand actions, buttons, active navigation, links.

Suggested Tailwind color:

Blue 600

Hover:

Blue 700

Pressed:

Blue 800

---

## Success

Green

Used for:

- Completed requests
- Successful uploads
- Verified runners
- Successful API actions

---

## Warning

Amber

Used for:

- Pending requests
- Missing profile information
- Attention-required actions

---

## Danger

Red

Used for:

- Cancelled requests
- Delete actions
- Failed uploads
- Errors

---

## Neutral

Slate

Used for:

- Backgrounds
- Cards
- Borders
- Typography

---

# Background Layers

The application uses three background levels.

Level 1

Application background

Level 2

Cards

Tables

Dialogs

Level 3

Dropdowns

Menus

Popovers

This layered system improves hierarchy while remaining visually minimal.

---

# Typography

Use:

Inter

Fallback:

System UI

Never mix fonts.

---

# Typography Scale

Display

Landing page hero.

Heading 1

Dashboard titles.

Heading 2

Section titles.

Heading 3

Card titles.

Body Large

Descriptions.

Body

General content.

Small

Table metadata.

Caption

Helper text.

---

# Font Weight

Regular

Body.

Medium

Labels.

Semibold

Cards.

Bold

Page titles.

---

# Border Radius

Small

Inputs

Medium

Cards

Buttons

Large

Dialogs

Extra Large

Marketing hero cards

Avoid sharp corners.

---

# Shadow System

Small

Inputs

Buttons

Medium

Cards

Large

Dialogs

Drawers

Avoid heavy shadows.

---

# Spacing Scale

Use an 8px spacing system.

Examples

8

16

24

32

40

48

64

Consistent spacing is more important than exact values.

---

# Layout

Desktop

Sidebar

Top Navigation

Content Area

Mobile

Drawer Navigation

Sticky Header

Scrollable Content

Avoid nested scrolling.

---

# Grid System

Landing

12-column grid

Dashboard

Responsive cards

Forms

Single-column

Two-column on desktop where appropriate.

---

# Buttons

Variants

Primary

Secondary

Outline

Ghost

Destructive

Link

Loading

Disabled

Sizes

Small

Medium

Large

Icon

Buttons should display loading indicators while awaiting API responses.

---

# Inputs

Every form input should include:

Label

Placeholder

Validation

Helper Text

Error Message

Optional Indicator

Never rely solely on placeholders.

---

# Form Validation

Validation occurs using Zod.

Validation should occur:

On submit

After first interaction

Never display validation errors before the user interacts with a field.

---

# Cards

Cards are the primary surface throughout the application.

Each card contains:

Header

Title

Optional description

Content

Footer

Cards should remain simple and avoid unnecessary nesting.

---

# Tables

Used for:

Requests

Users

Runners

Statistics

Payments

Tables should support:

Sorting

Filtering

Searching

Pagination

Responsive overflow

Row actions

Bulk actions (future)

---

# Status Badges

Every procurement status has a standardized badge.

Pending

Assigned

In Progress

Completed

Cancelled

Each badge should use consistent colors and icons throughout the application.

---

# Timeline Component

Every procurement request displays a timeline instead of plain text.

Example

Pending

↓

Assigned

↓

In Progress

↓

Completed

The active step should be visually highlighted.

Cancelled should terminate the timeline immediately.

---

# Search

Global search appears in:

Admin

Runner

Expat dashboards

Search should debounce requests.

---

# Filters

Filters should use popovers instead of full pages.

Common filters:

Status

Municipality

Runner

Date

Priority

---

# Empty States

Every page must define an empty state.

Examples

No Requests

No Jobs

No Users

No Notifications

Empty states should explain what the user can do next.

---

# Loading States

Never display blank pages.

Use Skeleton components.

Loading indicators should match the layout being loaded.

---

# Error States

All API failures should display meaningful messages.

Include:

Error title

Description

Retry action

Errors should never expose raw backend responses.

---

# Toast Notifications

Use Sonner.

Success

Error

Warning

Information

Avoid modal dialogs for simple confirmations.

---

# Dialogs

Dialogs should be used for:

Delete confirmation

Runner verification

Status updates

Profile editing

Large forms should use dedicated pages instead.

---

# Icons

Use Lucide React exclusively.

Every major navigation item should have an icon.

Icons should remain visually consistent.

---

# Motion

Animations should be subtle.

Use Framer Motion.

Allowed:

Fade

Slide

Scale

Hover

Accordion

Avoid excessive motion.

---

# Accessibility

Minimum touch target:

44px

All inputs require labels.

Buttons require accessible names.

Keyboard navigation must function throughout the application.

Focus indicators should remain visible.

---

# Responsive Behaviour

Mobile

Single-column

Tablet

Adaptive cards

Desktop

Sidebar layout

Never hide important actions on smaller screens.

---

# Dark Mode

Dark mode should not simply invert colors.

Ensure:

Readable contrast

Comfortable backgrounds

Soft borders

Muted dividers

Professional appearance

---

# Design Principles

The interface should always communicate:

Trust

Transparency

Speed

Simplicity

Professionalism

Every new component should reinforce these five principles.


# Chapter 3 — Frontend Architecture

---

# Architecture Philosophy

The frontend follows a **Feature-First Modular Architecture**.

The architecture mirrors the backend modules to reduce cognitive load and simplify maintenance.

Every business domain owns its own pages, components, services, hooks, types, and utilities.

No feature should directly modify another feature's internal implementation.

Communication between features occurs only through shared services or API contracts.

---

# Core Principles

The frontend should always follow these principles:

- Feature-first organization
- Separation of concerns
- Reusable UI components
- Server state separated from UI state
- Predictable folder structure
- Strong typing
- Minimal prop drilling
- Composition over inheritance
- Backend is the source of truth

---

# Project Structure

src/

    app/
        App.tsx
        router.tsx
        providers.tsx

    api/
        axios.ts
        endpoints.ts

    assets/

    components/
        ui/
        common/
        layouts/

    features/

        auth/

        expat/

        runner/

        admin/

        procurement/

        marketplace/

    hooks/

    lib/

    providers/

    router/

    services/

    store/

    styles/

    types/

    utils/

---

# Feature Structure

Every feature follows the same structure.

Example

features/procurement/

    api/

    components/

    hooks/

    pages/

    services/

    types/

    validation/

    index.ts

No feature should become a dumping ground.

---

# Shared Components

Reusable UI lives inside

components/

Examples

Button

Card

Badge

Dialog

Modal

Avatar

Table

Sidebar

Navbar

Pagination

Timeline

StatusBadge

Skeleton

EmptyState

LoadingSpinner

SearchBar

These components contain no business logic.

---

# Business Components

Business-specific components remain inside their feature.

Example

features/procurement/components/

CreateRequestForm

RequestTimeline

RequestStatusCard

UploadScanDialog

RunnerAssignmentCard

These components should never be reused globally.

---

# Routing

Use React Router v7.

Top-level routes

/

/login

/register

/about

/contact

/dashboard

/expat

/runner

/admin

*

404

---

# Nested Routing

Example

/expat

/dashboard

/requests

/requests/new

/requests/:id

/profile

/settings

Runner

/dashboard

/jobs

/jobs/:id

/history

/profile

/settings

Admin

/dashboard

/users

/users/:id

/runners

/requests

/statistics

/settings

---

# Layout System

Landing Layout

Authentication Layout

Dashboard Layout

Admin Layout

Every layout owns:

Navigation

Header

Breadcrumbs

Footer

Theme Switch

Notifications

Profile Menu

---

# Authentication Provider

Create

AuthProvider

Responsibilities

Store JWT

Fetch current user

Determine role

Persist session

Logout

Refresh user

Redirect after login

The AuthProvider becomes the single source of truth for authentication.

---

# Role Guards

GuestGuard

AuthenticatedGuard

AdminGuard

RunnerGuard

ExpatGuard

Never hide UI without protecting routes.

Authorization belongs to routing, not component rendering.

---

# API Layer

Every API request passes through

api/axios.ts

↓

service

↓

React Query hook

↓

page

Never call Axios directly inside pages.

---

# Axios Configuration

Single Axios instance.

Responsibilities

Base URL

Bearer Token

Request Interceptors

Response Interceptors

401 handling

Automatic logout

Retry strategy

Timeout

---

# API Services

Example

auth.service.ts

Contains

login()

register()

logout()

getCurrentUser()

verifyKyc()

Never place React Query inside services.

Services only communicate with APIs.

---

# TanStack Query

Every server request uses TanStack Query.

Query

useCurrentUser()

Mutation

useLogin()

Query

useRequests()

Mutation

useCreateRequest()

Never duplicate server state inside React Context.

---

# Query Keys

Use predictable keys.

auth

current-user

requests

request

runner-jobs

marketplace

statistics

users

Avoid string literals throughout the project.

Centralize keys.

---

# Cache Strategy

Dashboard

5 minutes

Current User

10 minutes

Statistics

5 minutes

Request Detail

2 minutes

Invalidate automatically after mutations.

---

# Form Architecture

Every form uses

React Hook Form

+

Zod

Validation resides inside

validation/

Example

create-request.schema.ts

login.schema.ts

register.schema.ts

Never place validation directly inside components.

---

# State Management

Server State

TanStack Query

Local State

React State

Shared UI State

Context

Avoid Redux.

The application is not large enough to justify it.

---

# Error Handling

Every feature owns:

Error Boundary

Fallback UI

Retry mechanism

No unhandled promise rejections.

---

# Loading Strategy

Every page

Skeleton

Every table

Skeleton Rows

Every dashboard

Card Skeletons

Every dialog

Spinner

Avoid loading spinners in the center of otherwise blank pages.

---

# Notifications

Use Sonner.

Success

Error

Warning

Info

Every mutation should notify the user.

---

# Theme Provider

Provide

Dark Mode

Light Mode

System Preference

Persist choice locally.

---

# Environment Variables

Example

VITE_API_URL

Never hardcode URLs.

---

# Utilities

utils/

date.ts

currency.ts

status.ts

string.ts

storage.ts

permissions.ts

Keep utilities pure.

---

# Type Definitions

Global types remain inside

types/

Business types remain inside

features/*/types

Avoid giant global interfaces.

---

# Naming Conventions

Pages

PascalCase

Components

PascalCase

Hooks

camelCase starting with use

Services

camelCase

Constants

UPPER_SNAKE_CASE

Enums

PascalCase

Folders

lowercase

---

# Barrel Exports

Every feature exposes

index.ts

Only export public APIs.

Internal implementation remains private.

---

# Code Quality

Every file should have one clear responsibility.

Prefer components under approximately 200 lines.

Extract repeated logic into custom hooks.

Avoid deeply nested JSX.

Prefer composition over large conditional rendering blocks.

---

# Performance

Use lazy loading for routes.

Memoize expensive computations.

Virtualize very large tables if required.

Avoid unnecessary re-renders.

Use optimistic updates where appropriate.

---

# Security

Never trust frontend validation.

Never expose secrets.

Never store sensitive information outside the JWT strategy.

Always assume backend validation is authoritative.

---

# Testing Strategy (Future)

Unit

Components

Hooks

Utilities

Integration

Pages

API

Authentication

End-to-End

Critical user flows

Testing is not required for MVP but architecture should support it.

---

# Definition of Done

A feature is complete when:

✓ API integration works

✓ Loading state exists

✓ Error state exists

✓ Empty state exists

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ Fully typed

✓ Validation complete

✓ Toast notifications implemented

✓ Query cache invalidated correctly

✓ No console errors

✓ No TypeScript errors

✓ No ESLint errors


# Chapter 4 — Landing Page & Authentication

---

# Purpose

The landing page should immediately communicate:

"What is WodaLink?"

Within five seconds, a visitor should understand:

- Who the platform is for.
- What problem it solves.
- How it works.
- Why it can be trusted.
- What they should do next.

The landing page is not a marketing gimmick.

It should establish trust.

---

# Target Audience

Primary

• Nepali citizens living abroad.

Secondary

• Local runners in Nepal.

Tertiary

• Administrators.

The homepage should primarily speak to Expats.

---

# Visual Direction

Modern SaaS.

Minimal.

Professional.

Lots of whitespace.

Rounded cards.

Soft shadows.

Large typography.

Subtle animations.

Avoid:

- stock illustrations
- government portal appearance
- large colorful gradients
- unnecessary graphics

---

# Navigation

Desktop Navigation

Logo

Home

How It Works

Become a Runner

FAQ

Login

Register

Theme Toggle

Mobile Navigation

Drawer

Same navigation items

Sticky Header

---

# Hero Section

Headline

Get Official Nepali Documents Without Returning Home

Subheading

Connect with verified local runners who can procure government documents on your behalf while you track every step of the process.

Primary CTA

Request a Document

Secondary CTA

Become a Runner

Right Side

Modern dashboard preview

OR

Illustration showing

Expat

↓

Runner

↓

Government Office

↓

Completed Request

---

# Trust Section

Display trust indicators.

Examples

✓ Verified Runners

✓ Transparent Status Tracking

✓ Secure Authentication

✓ Government Document Procurement

These should be presented as feature cards.

---

# How It Works

Three-step process.

Step 1

Create Request

Describe the document you need.

Step 2

Runner Accepts

A verified local runner claims your request.

Step 3

Track Progress

Monitor every stage until completion.

Represent using timeline cards.

---

# Features Section

Card Grid

Feature 1

Request Tracking

Feature 2

Verified Runners

Feature 3

Secure Authentication

Feature 4

Role-Based Dashboard

Feature 5

Status Timeline

Feature 6

Modern Procurement Workflow

Each card contains:

Icon

Title

Description

---

# Why WodaLink

Explain the problem.

Many Nepali citizens abroad need official government documents but cannot travel back to Nepal.

Traditional methods rely on friends or family, lack transparency, and provide no standardized workflow.

WodaLink digitizes the coordination process while maintaining visibility into every stage.

---

# FAQ

Accordion

Examples

How do runners work?

How long does procurement take?

How is my request tracked?

How do I become a runner?

Do I need to visit Nepal?

---

# Footer

Links

About

Privacy

Terms

Support

Contact

GitHub (optional)

Copyright

---

# Authentication

Authentication follows JWT Bearer Token strategy.

The frontend should never implement authentication logic outside AuthProvider.

---

# Login Page

Purpose

Authenticate existing users.

Fields

Email

Password

Remember Me

Buttons

Login

Forgot Password (future)

Register

Validation

Email format

Required password

Loading state

Error state

Upon success

Receive JWT

↓

Store token

↓

Fetch current user

↓

Determine role

↓

Redirect

---

# Registration Page

Purpose

Create a new account.

Fields

Full Name

Email

Password

Confirm Password

Role

Role Options

Expat

Runner

Conditional Field

Municipality

Only visible if role = Runner.

Validation

Strong password

Matching confirmation

Required fields

Successful registration

↓

Redirect Login

OR

Auto Login

---

# Authentication Layout

Centered card.

Company logo.

Large heading.

Short description.

Minimal distractions.

Dark mode compatible.

---

# Session Management

Store JWT securely.

Persist login.

Fetch current user on refresh.

Logout clears:

Token

Query Cache

User State

Redirect to Login.

---

# Role Redirection

After login

Admin

↓

/admin/dashboard

Runner

↓

/runner/dashboard

Expat

↓

/expat/dashboard

Never ask the user where to go.

Determine automatically.

---

# Unauthorized Page

Title

Unauthorized

Description

You do not have permission to access this page.

Buttons

Go to Dashboard

Logout

---

# Not Found

Friendly 404 page.

Illustration optional.

Button

Return Home

---

# KYC Flow

Runner accounts require KYC verification.

Status

Pending

Verified

Rejected

If Pending

Display informative banner.

Some functionality may remain disabled until verification.

---

# Profile Completion

If important profile information is missing:

Display a completion banner.

Show completion percentage.

Provide quick actions.

Never interrupt workflow with forced modals.

---

# Empty Authentication States

Loading Session

Skeleton

Checking Authentication

Centered loader

Expired Session

Toast

↓

Redirect Login

Invalid Token

Automatic logout

---

# Error Handling

Authentication failures should never expose backend messages directly.

Translate into user-friendly language.

Examples

Invalid email or password.

Your session has expired.

Unable to connect.

Please try again.

---

# Accessibility

Keyboard navigation.

Focus indicators.

Enter submits forms.

Password visibility toggle.

ARIA labels.

Screen-reader friendly validation.

---

# Success Criteria

Authentication is considered complete when:

✓ Register

✓ Login

✓ JWT stored

✓ Current user fetched

✓ Role determined

✓ Protected routes enforced

✓ Logout works

✓ Refresh persists session

✓ Responsive

✓ Dark mode supported

✓ Accessible

✓ Fully typed

✓ No console errors

# Chapter 5 — Expat Portal

---

# Purpose

The Expat Portal is the primary interface for customers requesting official government documents from Nepal.

The experience should emphasize:

- Simplicity
- Transparency
- Progress visibility
- Trust
- Fast access to important actions

The portal should allow an Expat to complete their entire journey without needing assistance.

---

# Navigation

Sidebar

Dashboard

My Requests

Create Request

Profile

Settings

Logout

Top Navigation

Search (Future)

Notifications (Future)

Theme Toggle

Profile Menu

---

# Dashboard

Purpose

Provide a quick overview of the user's procurement activity.

Widgets

Welcome Card

Recent Requests

Request Statistics

Current Active Request

Quick Actions

---

## Welcome Card

Displays

Greeting

User Name

Role

Profile Completion

CTA

Create New Request

---

## Statistics Cards

Display

Total Requests

Pending Requests

In Progress

Completed

Cancelled

Each card links to filtered request lists.

---

## Recent Requests

Display latest requests.

Each row includes

Request ID

Document Type

Municipality

Current Status

Created Date

View Details Button

---

## Current Active Request

If an active request exists

Display

Current Status

Assigned Runner

Estimated Progress

Timeline

Primary Action

View Request

If none exists

Display Empty State

"Create your first procurement request."

---

# My Requests

Purpose

Display every procurement request submitted by the authenticated Expat.

API

GET /procurement

Features

Search

Filter

Pagination

Sort

Responsive Table

---

## Columns

Request ID

Document Type

Municipality

Runner

Status

Created Date

Actions

---

## Actions

View Details

Download Scan (Completed)

Cancel Request (Pending only)

---

# Request Detail

Purpose

Display the complete lifecycle of a procurement request.

API

GET /procurement/:id

---

## Header

Request ID

Current Status Badge

Created Date

Assigned Runner

---

## Timeline

Visual Timeline

Pending

↓

Assigned

↓

In Progress

↓

Completed

Cancelled

Current step highlighted.

Future steps muted.

Cancelled terminates timeline.

---

## Request Information Card

Document Type

Municipality

Purpose

Notes

Created At

Updated At

---

## Runner Information

Visible once assigned.

Display

Runner Name

Verification Status

Municipality

Rating (Future)

---

## Uploaded Documents

When status = Completed

Display

Document Preview

File Name

Upload Date

Download Button

If no scan exists

Show informational message.

---

## Activity Timeline

Chronological events.

Examples

Request Created

Runner Assigned

Work Started

Document Uploaded

Completed

Each event includes

Timestamp

Status

Description

---

# Create Request

Purpose

Allow an Expat to submit a new procurement request.

API

POST /procurement

---

## Form Fields

Document Type

Municipality

Purpose

Additional Notes

Required Documents (Future)

---

Validation

React Hook Form

+

Zod

---

Buttons

Submit

Reset

Cancel

---

Success

Toast

↓

Redirect

↓

Request Detail

---

# Edit Request

Available only while

Status == Pending

Editable Fields

Purpose

Notes

Municipality

Document Type

If request has already been assigned

Editing is disabled.

---

# Cancel Request

Available only while

Pending

Confirmation Dialog

Reason (optional)

Confirmation Button

Cancellation immediately updates UI.

---

# Empty State

No Requests

Illustration

Message

"You haven't created any requests yet."

Primary Action

Create Request

---

# Loading States

Dashboard Cards

Skeleton

Tables

Skeleton Rows

Timeline

Skeleton

Request Detail

Placeholder Cards

---

# Error States

Unable to load dashboard.

Unable to load request.

Unable to submit request.

Unable to cancel request.

Retry button provided where appropriate.

---

# Profile

Purpose

Manage user information.

API

GET /expat/profile

PATCH /users/profile

---

Fields

Full Name

Email

Phone (Future)

Country (Future)

Preferred Language (Future)

---

Actions

Save Changes

Cancel

---

# Settings

Theme

Dark

Light

System

Language (Future)

Notification Preferences (Future)

Security (Future)

---

# Permissions

Expat users can

✓ Create Requests

✓ View Own Requests

✓ Cancel Pending Requests

✓ View Uploaded Scans

✓ Update Profile

Expats cannot

✗ Claim Jobs

✗ View Other Users

✗ Access Admin Features

---

# Responsive Behaviour

Desktop

Sidebar

Tablet

Collapsible Sidebar

Mobile

Bottom spacing

Drawer Navigation

Tables become cards.

Timeline becomes vertical.

---

# Success Criteria

The Expat Portal is complete when

✓ Dashboard displays correctly

✓ Request creation works

✓ Request list works

✓ Request detail displays timeline

✓ Status updates automatically

✓ Profile editing works

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ Fully typed

✓ No console errors

✓ All data comes from backend APIs

# Chapter 6 — Runner Portal

---

# Purpose

The Runner Portal is the operational workspace for verified runners.

Unlike the Expat Portal, which focuses on visibility and request tracking, the Runner Portal focuses on execution.

The interface should enable runners to:

- Discover available procurement requests
- Claim jobs
- Manage active work
- Update request progress
- Upload completed document scans
- Track completed work
- Manage their availability

The Runner experience should minimize clicks and prioritize efficiency.

---

# Navigation

Sidebar

Dashboard

Available Jobs

My Jobs

Completed Jobs

Profile

Settings

Logout

Top Navigation

Theme Toggle

Profile Menu

Availability Switch

---

# Dashboard

Purpose

Provide runners with an overview of their workload and activity.

API

GET /runner/profile

GET /runner/jobs

Widgets

Welcome Card

Availability Status

Current Jobs

Completed Jobs

Quick Statistics

Recent Activity

---

## Welcome Card

Display

Runner Name

Verification Status

Municipality

Availability Status

Quick Action

Browse Jobs

---

## Statistics Cards

Display

Available Jobs

Claimed Jobs

Completed Jobs

Completion Rate

Cards should be clickable and filter corresponding pages.

---

## Current Work

Display

Request ID

Document Type

Municipality

Current Status

Continue Button

Only active jobs appear.

---

## Recent Activity

Timeline

Examples

Claimed Request

Started Procurement

Uploaded Scan

Completed Request

Newest activity first.

---

# Availability

Purpose

Allow runners to indicate whether they are currently accepting new work.

API

PATCH /marketplace/availability

Component

Switch

States

Available

Unavailable

Behavior

Optimistic update.

If request fails

Automatically revert switch.

Display toast.

---

# Available Jobs

Purpose

Display procurement requests that are currently unclaimed.

API

GET /marketplace/open-jobs

---

## Layout

Desktop

Responsive table.

Mobile

Card layout.

---

## Columns

Request ID

Document Type

Municipality

Created Date

Priority (Future)

Actions

---

## Actions

View Details

Claim Job

---

# Claim Job

API

POST /marketplace/claim

Confirmation Dialog

Title

Claim this request?

Body

Once claimed, this request becomes part of your active work.

Buttons

Cancel

Claim

On Success

Toast

↓

Refresh Open Jobs

↓

Refresh My Jobs

↓

Redirect to Job Details

---

# My Jobs

Purpose

Display all active procurement requests assigned to the authenticated runner.

API

GET /runner/jobs

Display

Only

Assigned

In Progress

---

## Columns

Request ID

Document Type

Municipality

Current Status

Assigned Date

Actions

---

Actions

Open Job

Start Work

Continue Work

Upload Scan

---

# Job Detail

Purpose

Provide runners with every piece of information required to complete procurement.

API

GET /procurement/:id

---

## Header

Request ID

Status

Municipality

Assigned Date

---

## Request Details

Document Type

Purpose

Notes

Special Instructions

---

## Status Timeline

Display

Pending

↓

Assigned

↓

In Progress

↓

Completed

Highlight current step.

Timeline should match Expat Portal.

---

# Status Actions

Based on current state.

ASSIGNED

Primary Action

Start Procurement

Calls

PATCH /procurement/start

---

IN_PROGRESS

Primary Action

Upload Scan

Calls

PATCH /procurement/upload-scan

---

COMPLETED

Read-only.

No editing.

---

# Upload Scan

Purpose

Complete procurement.

API

PATCH /procurement/upload-scan

---

Fields

Document Scan

Optional Notes

Buttons

Cancel

Upload

Success

Toast

↓

Status updates

↓

Timeline refreshes

↓

Redirect

---

# Release Request

Purpose

Allow runner to return a claimed request.

API

PATCH /marketplace/release

Available only before work begins.

Confirmation required.

---

# Completed Jobs

Purpose

Display completed procurement history.

API

GET /runner/jobs/history

---

Columns

Request ID

Municipality

Document Type

Completed Date

Completion Time

Actions

View Details

---

# Runner Profile

Purpose

Manage personal information.

API

GET /runner/profile

PATCH /users/profile

---

Display

Name

Email

Municipality

Verification Status

Availability

---

Editable

Name

Phone (Future)

Avatar (Future)

---

Read Only

Email

Municipality

Verification Status

---

# Verification Banner

If KYC

Pending

Display banner.

Explain verification process.

Disable claiming jobs until verified.

If Verified

Display success badge.

---

# Empty States

No Open Jobs

"No procurement requests are currently available."

No Active Jobs

"You have not claimed any requests."

No Completed Jobs

"You haven't completed any procurements yet."

---

# Loading States

Dashboard Cards

Skeleton

Tables

Skeleton Rows

Timeline

Skeleton

Profile

Placeholder Cards

---

# Error States

Unable to fetch jobs.

Unable to claim request.

Unable to update availability.

Unable to upload scan.

Provide retry actions.

---

# Permissions

Runner can

✓ View Available Jobs

✓ Claim Jobs

✓ Release Jobs

✓ Update Availability

✓ Start Procurement

✓ Upload Scan

✓ View Completed Jobs

✓ Update Profile

Runner cannot

✗ Access Admin

✗ View Other Users

✗ Create Procurement Requests

✗ Modify Requests Belonging to Others

---

# Responsive Behaviour

Desktop

Sidebar

Data Tables

Tablet

Collapsible Sidebar

Responsive Tables

Mobile

Card Layout

Bottom Actions

Sticky Action Buttons

Timeline becomes vertical.

---

# Accessibility

Keyboard navigation

Visible focus indicators

Accessible dialogs

Labeled switches

Large touch targets

Screen-reader friendly forms

---

# Success Criteria

Runner Portal is complete when

✓ Dashboard loads correctly

✓ Open Jobs displays available requests

✓ Claim Job works

✓ Availability toggle works

✓ Active Jobs updates automatically

✓ Upload Scan works

✓ Completed Jobs displays history

✓ Profile editing works

✓ Fully responsive

✓ Accessible

✓ Dark mode supported

✓ Fully typed

✓ No console errors

✓ All API interactions use TanStack Query

# Chapter 7 — Admin Portal

---

# Purpose

The Admin Portal is the operational control center for WodaLink.

Administrators should be able to monitor, verify, manage, and maintain the entire platform from a single interface.

Unlike the Runner and Expat portals, the Admin Portal prioritizes information density while maintaining readability.

The interface should resemble modern SaaS administration tools.

Examples:

- Clerk Dashboard
- Stripe Dashboard
- Vercel Team Dashboard
- GitHub Enterprise

---

# Navigation

Sidebar

Dashboard

Users

Runners

Requests

Statistics

Payments

Settings

Logout

Top Navigation

Global Search

Theme Toggle

Profile Menu

---

# Dashboard

Purpose

Provide an overview of platform activity.

API

GET /admin/dashboard

Widgets

Platform Overview

Recent Activity

Pending Actions

Latest Requests

Latest Runner Registrations

Quick Statistics

---

## Statistics Cards

Display

Total Users

Verified Runners

Pending Requests

Completed Requests

Active Runners

Cancelled Requests

Cards should link to filtered tables.

---

## Recent Activity

Timeline

Examples

User Registered

Runner Verified

Request Created

Request Completed

Runner Claimed Job

Newest activity appears first.

---

## Pending Actions

Display tasks requiring administrator attention.

Examples

Runner KYC Pending

Flagged Requests

Pending Verifications

Each item contains

Action Button

View Details

---

# Users

Purpose

Manage every user on the platform.

API

GET /admin/users

---

Columns

Name

Email

Role

Status

Created Date

Actions

---

Filters

Role

Verification

Registration Date

Search

---

Actions

View User

Verify User

Suspend User

Reactivate User

---

User Detail

Display

Profile Information

Role

Verification Status

Request History

Runner History (if applicable)

---

# Runners

Purpose

Manage runner accounts.

API

GET /admin/runners

---

Columns

Runner

Municipality

Availability

Verification

Completed Jobs

Current Jobs

Actions

---

Actions

View Profile

Verify Runner

Suspend Runner

---

Runner Detail

Display

Runner Information

Availability

Verification Status

Assigned Jobs

Completed Jobs

Rating (Future)

Activity Timeline

---

# Procurement Requests

Purpose

Monitor all procurement requests.

API

GET /admin/requests

---

Columns

Request ID

Expat

Runner

Municipality

Status

Created Date

Actions

---

Filters

Status

Municipality

Runner

Date

Search

---

Actions

View Request

Assign Runner

Update Status

Cancel Request

---

Request Detail

Display

Complete procurement information

Timeline

Assigned Runner

Activity Log

Uploaded Scan

History

---

# Statistics

Purpose

Provide operational insights.

API

GET /admin/statistics

---

Cards

Total Users

Expats

Runners

Verified Runners

Completed Requests

Average Completion Time

---

Charts

Requests Per Month

Request Status Distribution

Runner Activity

User Growth

Municipality Distribution

Use Recharts.

Charts should remain simple.

---

# Payments

Purpose

Monitor payment status.

MVP

Display only.

Columns

Request

Amount

Status

Date

Payment Provider

No manual payment actions.

Future integrations

Refund

Escrow Release

Invoices

---

# Search

Global search available.

Searches

Users

Requests

Runners

Search should debounce API requests.

---

# Filters

Every table supports

Status

Role

Municipality

Date

Verification

Filters appear inside popovers.

---

# Bulk Actions (Future)

Select Multiple Users

Suspend

Verify

Export

Delete

Not required for MVP.

---

# Export (Future)

CSV

Excel

PDF

Not required for MVP.

---

# Settings

Display

Application Version

API Status

Theme

Admin Profile

Future

Platform Configuration

Payment Configuration

Email Templates

Notification Settings

---

# Activity Timeline

Every major action should appear chronologically.

Examples

User Created

Runner Verified

Job Claimed

Request Completed

Status Changed

---

# Empty States

No Users

No Requests

No Runners

No Payments

Display friendly illustrations.

Provide quick action.

---

# Loading States

Dashboard Cards

Skeleton

Charts

Skeleton

Tables

Skeleton Rows

Dialogs

Loading Spinner

---

# Error States

Unable to load users.

Unable to load statistics.

Unable to load requests.

Provide retry actions.

Never expose raw backend errors.

---

# Permissions

Administrator can

✓ View every user

✓ View every request

✓ Verify runners

✓ Suspend users

✓ Update request status

✓ View statistics

✓ View payments

✓ Manage platform

Administrator cannot

✗ Perform procurement work

✗ Claim runner jobs

---

# Responsive Behaviour

Desktop

Permanent Sidebar

Wide Tables

Tablet

Collapsible Sidebar

Horizontal Table Scroll

Mobile

Cards instead of tables

Drawer Navigation

Some charts become stacked.

---

# Accessibility

Keyboard navigation

Accessible tables

Dialog focus trapping

Screen-reader labels

Visible focus indicators

Proper heading hierarchy

---

# Success Criteria

The Admin Portal is complete when

✓ Dashboard displays system overview

✓ Users page functions correctly

✓ Runners page functions correctly

✓ Requests page functions correctly

✓ Statistics page renders charts

✓ Payments page displays payment history

✓ Global search works

✓ Filters work

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ Fully typed

✓ No console errors

✓ All API interactions use TanStack Query

# Chapter 7 — Admin Portal

---

# Purpose

The Admin Portal is the operational control center for WodaLink.

Administrators should be able to monitor, verify, manage, and maintain the entire platform from a single interface.

Unlike the Runner and Expat portals, the Admin Portal prioritizes information density while maintaining readability.

The interface should resemble modern SaaS administration tools.

Examples:

- Clerk Dashboard
- Stripe Dashboard
- Vercel Team Dashboard
- GitHub Enterprise

---

# Navigation

Sidebar

Dashboard

Users

Runners

Requests

Statistics

Payments

Settings

Logout

Top Navigation

Global Search

Theme Toggle

Profile Menu

---

# Dashboard

Purpose

Provide an overview of platform activity.

API

GET /admin/dashboard

Widgets

Platform Overview

Recent Activity

Pending Actions

Latest Requests

Latest Runner Registrations

Quick Statistics

---

## Statistics Cards

Display

Total Users

Verified Runners

Pending Requests

Completed Requests

Active Runners

Cancelled Requests

Cards should link to filtered tables.

---

## Recent Activity

Timeline

Examples

User Registered

Runner Verified

Request Created

Request Completed

Runner Claimed Job

Newest activity appears first.

---

## Pending Actions

Display tasks requiring administrator attention.

Examples

Runner KYC Pending

Flagged Requests

Pending Verifications

Each item contains

Action Button

View Details

---

# Users

Purpose

Manage every user on the platform.

API

GET /admin/users

---

Columns

Name

Email

Role

Status

Created Date

Actions

---

Filters

Role

Verification

Registration Date

Search

---

Actions

View User

Verify User

Suspend User

Reactivate User

---

User Detail

Display

Profile Information

Role

Verification Status

Request History

Runner History (if applicable)

---

# Runners

Purpose

Manage runner accounts.

API

GET /admin/runners

---

Columns

Runner

Municipality

Availability

Verification

Completed Jobs

Current Jobs

Actions

---

Actions

View Profile

Verify Runner

Suspend Runner

---

Runner Detail

Display

Runner Information

Availability

Verification Status

Assigned Jobs

Completed Jobs

Rating (Future)

Activity Timeline

---

# Procurement Requests

Purpose

Monitor all procurement requests.

API

GET /admin/requests

---

Columns

Request ID

Expat

Runner

Municipality

Status

Created Date

Actions

---

Filters

Status

Municipality

Runner

Date

Search

---

Actions

View Request

Assign Runner

Update Status

Cancel Request

---

Request Detail

Display

Complete procurement information

Timeline

Assigned Runner

Activity Log

Uploaded Scan

History

---

# Statistics

Purpose

Provide operational insights.

API

GET /admin/statistics

---

Cards

Total Users

Expats

Runners

Verified Runners

Completed Requests

Average Completion Time

---

Charts

Requests Per Month

Request Status Distribution

Runner Activity

User Growth

Municipality Distribution

Use Recharts.

Charts should remain simple.

---

# Payments

Purpose

Monitor payment status.

MVP

Display only.

Columns

Request

Amount

Status

Date

Payment Provider

No manual payment actions.

Future integrations

Refund

Escrow Release

Invoices

---

# Search

Global search available.

Searches

Users

Requests

Runners

Search should debounce API requests.

---

# Filters

Every table supports

Status

Role

Municipality

Date

Verification

Filters appear inside popovers.

---

# Bulk Actions (Future)

Select Multiple Users

Suspend

Verify

Export

Delete

Not required for MVP.

---

# Export (Future)

CSV

Excel

PDF

Not required for MVP.

---

# Settings

Display

Application Version

API Status

Theme

Admin Profile

Future

Platform Configuration

Payment Configuration

Email Templates

Notification Settings

---

# Activity Timeline

Every major action should appear chronologically.

Examples

User Created

Runner Verified

Job Claimed

Request Completed

Status Changed

---

# Empty States

No Users

No Requests

No Runners

No Payments

Display friendly illustrations.

Provide quick action.

---

# Loading States

Dashboard Cards

Skeleton

Charts

Skeleton

Tables

Skeleton Rows

Dialogs

Loading Spinner

---

# Error States

Unable to load users.

Unable to load statistics.

Unable to load requests.

Provide retry actions.

Never expose raw backend errors.

---

# Permissions

Administrator can

✓ View every user

✓ View every request

✓ Verify runners

✓ Suspend users

✓ Update request status

✓ View statistics

✓ View payments

✓ Manage platform

Administrator cannot

✗ Perform procurement work

✗ Claim runner jobs

---

# Responsive Behaviour

Desktop

Permanent Sidebar

Wide Tables

Tablet

Collapsible Sidebar

Horizontal Table Scroll

Mobile

Cards instead of tables

Drawer Navigation

Some charts become stacked.

---

# Accessibility

Keyboard navigation

Accessible tables

Dialog focus trapping

Screen-reader labels

Visible focus indicators

Proper heading hierarchy

---

# Success Criteria

The Admin Portal is complete when

✓ Dashboard displays system overview

✓ Users page functions correctly

✓ Runners page functions correctly

✓ Requests page functions correctly

✓ Statistics page renders charts

✓ Payments page displays payment history

✓ Global search works

✓ Filters work

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ Fully typed

✓ No console errors

✓ All API interactions use TanStack Query

# Chapter 8 — Shared Components & Design Patterns

---

# Purpose

The WodaLink frontend should prioritize consistency over creativity.

Every reusable UI element must have a single implementation that is shared across all features.

Business logic belongs inside feature modules.

Presentation belongs inside shared components.

---

# Component Philosophy

Every shared component should satisfy the following principles.

✓ Reusable

✓ Accessible

✓ Typed

✓ Theme Aware

✓ Responsive

✓ Stateless whenever possible

Components should never perform API requests directly.

Components receive data through props.

---

# Component Directory

components/

    ui/

    common/

    layouts/

---

# UI Components

These are wrappers around shadcn/ui.

Button

Input

Textarea

Select

Checkbox

Switch

Avatar

Badge

Card

Tabs

Popover

Tooltip

Dropdown

Dialog

Drawer

Sheet

Accordion

Separator

ScrollArea

Skeleton

Pagination

Breadcrumb

Table

Alert

AlertDialog

Toast

Progress

Command

Calendar

DatePicker

---

# Common Components

These contain business-agnostic functionality.

AppLogo

ThemeToggle

PageHeader

SectionHeader

PageContainer

ContentContainer

Sidebar

TopNavbar

ProfileDropdown

SearchInput

DataTable

StatusBadge

Timeline

StatCard

MetricCard

EmptyState

LoadingState

ErrorState

ConfirmDialog

DeleteDialog

UploadArea

FilePreview

UserAvatar

ProfileCard

FilterBar

SearchBar

PaginationBar

Breadcrumbs

---

# Layout Components

LandingLayout

AuthLayout

DashboardLayout

AdminLayout

CenteredLayout

BlankLayout

Layouts should only manage structure.

Never include business logic.

---

# Button Standards

Variants

Primary

Secondary

Outline

Ghost

Link

Destructive

Success

Warning

Loading

Every async action automatically disables the button.

Loading spinner appears inside button.

---

# Card Standard

Every card follows

Header

↓

Title

↓

Optional Description

↓

Content

↓

Footer

Cards should never exceed one responsibility.

---

# DataTable

The DataTable component becomes one of the most reused components.

Supports

Sorting

Pagination

Searching

Filtering

Row Actions

Empty State

Loading State

Responsive Layout

Columns defined through configuration.

Never duplicate table implementations.

---

# Status Badge

One reusable component.

Accepted values

Pending

Assigned

In Progress

Completed

Cancelled

Verified

Pending Verification

Unavailable

Available

Each status owns

Color

Icon

Label

The same badge appears everywhere.

---

# Timeline Component

Shared between

Runner

Expat

Admin

Input

Current Status

Output

Horizontal Timeline

Pending

↓

Assigned

↓

In Progress

↓

Completed

Cancelled displays separate terminal state.

Timeline colors are standardized.

---

# Stat Card

Used on every dashboard.

Contains

Icon

Metric

Title

Description

Optional Trend

Optional Percentage

Examples

Total Users

Completed Requests

Available Jobs

Completion Rate

---

# Metric Card

Larger version of StatCard.

May include chart.

Used only on Dashboard pages.

---

# Search Component

Reusable.

Supports

Debouncing

Keyboard shortcuts

Clear Button

Loading Indicator

Optional API integration.

---

# Filter Component

Filters displayed inside Popover.

Supports

Checkbox

Multi Select

Date Range

Status

Role

Municipality

Reusable across all tables.

---

# Empty State

Every feature uses the same component.

Contains

Illustration

Title

Description

Primary Action

Secondary Action

Examples

No Requests

No Users

No Jobs

No Payments

---

# Loading State

Use Skeletons.

Avoid generic loading spinners.

Dashboard

Skeleton Cards

Table

Skeleton Rows

Profile

Skeleton Sections

Timeline

Skeleton Timeline

---

# Error State

One shared component.

Contains

Error Icon

Title

Description

Retry Button

Never expose backend messages.

---

# Dialog Standard

Dialog Types

Confirmation

Delete

Edit

Information

Dialogs remain focused.

Large forms should use pages instead.

---

# Upload Area

Reusable drag-and-drop upload.

Supports

Browse

Drag

Remove

Preview

Progress

Validation

Maximum file size

Accepted types

Used for

KYC

Document Scan

Future Avatar Upload

---

# Avatar

Supports

Image

Fallback Initials

Online Indicator (Future)

Verification Badge

---

# Profile Card

Displays

Avatar

Name

Role

Verification

Municipality

Actions

Shared by

Runner

Admin

Expat

---

# Sidebar

Persistent Desktop

Collapsible Tablet

Drawer Mobile

Supports

Nested Navigation

Icons

Badges

Role Filtering

---

# Navbar

Contains

Breadcrumbs

Theme Toggle

Notifications

Profile Menu

Search

Responsive

---

# Breadcrumbs

Automatically generated from route metadata.

Example

Dashboard

>

Requests

>

Request Detail

---

# Charts

Use Recharts.

Allowed

Line

Bar

Area

Pie

Donut

Avoid

3D charts

Complex animations

Radar charts

---

# Forms

All forms follow the same pattern.

Label

↓

Input

↓

Helper Text

↓

Validation

↓

Error Message

↓

Submit Button

Never mix layouts.

---

# Form Buttons

Primary

Save

Submit

Create

Secondary

Cancel

Reset

Back

Danger

Delete

---

# Icons

Use Lucide React exclusively.

Every navigation item requires an icon.

Avoid emoji.

---

# Responsive Behaviour

Desktop

Full Layout

Tablet

Adaptive

Mobile

Cards instead of tables

Bottom spacing

Drawer Navigation

---

# Accessibility

Every component must support

Keyboard Navigation

ARIA Labels

Focus Indicators

Screen Readers

Reduced Motion

High Contrast

---

# Performance

Memoize expensive components.

Lazy load dialogs.

Virtualize very large tables.

Avoid unnecessary rerenders.

---

# Component Documentation

Every shared component should define

Purpose

Props

Examples

Accessibility Notes

Usage Guidelines

Future Enhancements

This makes components discoverable for both developers and AI.

---

# Definition of Reusable

A component belongs in the shared library only if it is used in two or more features.

Otherwise, it remains inside its feature module.

Example

StatusBadge

Shared

RequestTimeline

Shared

CreateRequestForm

Feature-specific

RunnerAvailabilityCard

Feature-specific

AdminStatisticsChart

Feature-specific

---

# Success Criteria

The component system is complete when

✓ No duplicate UI components exist

✓ Every dashboard uses shared cards

✓ Every table uses DataTable

✓ Every status uses StatusBadge

✓ Every workflow uses Timeline

✓ Every form follows the same structure

✓ Every dialog follows the same pattern

✓ Responsive

✓ Accessible

✓ Theme-aware

✓ Fully typed

✓ Consistent across all portals

# Chapter 9 — API Integration & State Management

---

# Philosophy

The backend is the single source of truth.

The frontend never:

- Invents business logic
- Calculates permissions
- Assumes state transitions
- Stores duplicated server state

All business rules come from the backend.

---

# Architecture

Every API request follows this flow.

UI

↓

React Query Hook

↓

Service

↓

Axios Client

↓

NestJS API

Pages and components never call Axios directly.

---

# Folder Structure

src/

    api/
        axios.ts
        endpoints.ts
        queryKeys.ts

    services/

        auth.service.ts

        procurement.service.ts

        marketplace.service.ts

        admin.service.ts

    features/

        auth/hooks/

        procurement/hooks/

        marketplace/hooks/

        admin/hooks/

---

# Axios Client

Single Axios instance.

Responsibilities

✓ Base URL

✓ Authorization Header

✓ Request Interceptor

✓ Response Interceptor

✓ Timeout

✓ Automatic Logout

✓ Token Injection

Never create multiple Axios instances.

---

# Authorization

Every authenticated request automatically sends

Authorization: Bearer <token>

Pages never manually attach tokens.

---

# Authentication Lifecycle

User logs in

↓

JWT returned

↓

Store Token

↓

Fetch Current User

↓

Determine Role

↓

Redirect

↓

Initialize Query Cache

---

# Token Storage

MVP

localStorage

Future

HTTP Only Cookie

Only the AuthProvider may read/write authentication tokens.

---

# React Query

Every GET request uses useQuery.

Every POST, PATCH, DELETE uses useMutation.

Never bypass React Query.

---

# Query Key Structure

Centralize all query keys.

Example

auth.currentUser

procurement.requests

procurement.request(id)

runner.jobs

marketplace.openJobs

admin.users

admin.runners

admin.requests

admin.statistics

Never hardcode query keys.

---

# Cache Strategy

Current User

10 minutes

Dashboard Statistics

5 minutes

Request List

2 minutes

Request Detail

2 minutes

Runner Jobs

1 minute

Open Jobs

30 seconds

---

# Cache Invalidation

After Create Request

Invalidate

procurement.requests

dashboard.statistics

After Claim Job

Invalidate

marketplace.openJobs

runner.jobs

admin.requests

After Upload Scan

Invalidate

request

runner.jobs

dashboard

After Update Profile

Invalidate

currentUser

runner.profile

expat.profile

---

# Optimistic Updates

Allowed

Availability Toggle

Favorite (Future)

Theme Change

Not Allowed

Create Request

Upload Scan

Status Updates

Authentication

---

# Error Handling

Axios intercepts

401

↓

Logout

↓

Redirect Login

403

↓

Unauthorized Page

500

↓

Toast

↓

Retry

---

# Service Layer

Services communicate only with APIs.

Example

auth.service

login()

register()

logout()

me()

verifyKyc()

---

procurement.service

createRequest()

getRequests()

getRequest()

updateRequest()

cancelRequest()

uploadScan()

---

marketplace.service

getOpenJobs()

claimJob()

releaseJob()

updateAvailability()

getRunnerJobs()

---

admin.service

getUsers()

getRunners()

getRequests()

getStatistics()

---

# React Query Hooks

Every service has matching hooks.

Example

useCurrentUser()

useLogin()

useRegister()

useRequests()

useRequest(id)

useCreateRequest()

useClaimJob()

useRunnerJobs()

useStatistics()

Naming should remain predictable.

---

# Authentication Hook

Create

useAuth()

Provides

login

logout

user

role

loading

authenticated

No page should manipulate authentication directly.

---

# Role Helpers

Create helper functions.

isAdmin()

isRunner()

isExpat()

Used only for UI rendering.

Backend still authorizes requests.

---

# API Response Handling

Every API response passes through service layer.

Transform data if necessary.

Never transform inside components.

---

# Loading Strategy

Each query exposes

Loading

Success

Error

Empty

Every page must implement all four states.

---

# Pagination

Server-driven.

Frontend only sends

page

limit

sort

filter

Never paginate client-side when server pagination exists.

---

# Searching

Search input

↓

Debounce

↓

React Query

↓

API

Avoid firing requests on every keystroke.

---

# Filtering

Filters belong in URL parameters when possible.

Example

status

municipality

role

date

This allows deep linking.

---

# File Upload Strategy

MVP

Multipart FormData

Progress indicator

Preview before upload

Validation

Future

Cloud Storage

Signed URLs

CDN

---

# API Modules

Identity

Authentication

Profile

Registration

KYC

Procurement

Requests

Timeline

Upload Scan

Status

Marketplace

Open Jobs

Claim Job

Availability

Runner Jobs

Admin

Users

Requests

Statistics

Runners

---

# Retry Strategy

GET

Retry once

POST

No automatic retry

PATCH

No automatic retry

DELETE

No automatic retry

Prevent duplicate mutations.

---

# Toast Strategy

Success

Green

Error

Red

Warning

Amber

Information

Blue

Every mutation should provide feedback.

---

# Environment Variables

VITE_API_URL

VITE_APP_NAME

Never hardcode URLs.

---

# Offline Behaviour

MVP

Display connection error.

Retry manually.

Future

Offline queue.

---

# Logging

Development

Console logging allowed.

Production

No console logs.

Errors routed through centralized handler.

---

# Definition of Done

API integration is complete when

✓ Every endpoint has a service

✓ Every service has React Query hooks

✓ Query keys centralized

✓ Cache invalidation works

✓ Authentication automatic

✓ Authorization automatic

✓ Loading states complete

✓ Error states complete

✓ Empty states complete

✓ Toast notifications implemented

✓ No duplicated API logic

✓ No Axios inside components

✓ No business logic inside UI

✓ Fully typed

# Chapter 10 — Engineering Standards & AI Generation Rules

---

# Purpose

This chapter defines the engineering standards that every generated file must follow.

The objective is to produce a maintainable, scalable, production-ready frontend that mirrors the backend architecture.

These rules are mandatory.

If a generated implementation conflicts with these standards, these standards take precedence.

---

# General Principles

Every line of code should optimize for:

- Readability
- Maintainability
- Reusability
- Type Safety
- Predictability

Avoid clever solutions.

Prefer boring, well-tested patterns.

---

# Backend First

The backend is the source of truth.

The frontend must never:

- invent endpoints
- invent request bodies
- invent response structures
- invent business rules
- invent permissions

Every API interaction must correspond to an existing Swagger endpoint.

---

# TypeScript Rules

TypeScript Strict Mode is mandatory.

Never use:

any

unknown (unless absolutely necessary)

ts-ignore

eslint-disable

Type assertions should be rare.

Prefer proper typing.

Every API response must have an interface.

Every request body must have an interface.

Every component props object must have an interface.

---

# React Rules

Prefer functional components.

Never use class components.

Use hooks.

Keep components focused.

Prefer composition.

Avoid inheritance.

---

# Component Size

Target

100–150 lines

Maximum

250 lines

If a component grows larger,

split it into smaller components.

---

# Hook Rules

Business logic belongs inside hooks.

Examples

useRequests()

useRunnerJobs()

useStatistics()

useAvailability()

Pages should orchestrate.

Hooks should execute logic.

---

# API Rules

Never call Axios inside

pages

components

dialogs

tables

cards

Only services communicate with APIs.

---

# Service Rules

Services

only

perform HTTP communication.

No React Query.

No React State.

No UI logic.

---

# React Query Rules

Every query has

Loading

Error

Success

Empty

Mutations invalidate caches.

Never manually refresh pages.

---

# State Management

React Query

↓

Server State

React State

↓

Local UI

Context

↓

Shared UI

Never duplicate server state inside Context.

---

# Folder Rules

Every feature owns

components

hooks

pages

services

types

validation

Do not place feature code inside shared folders.

---

# Import Order

1.

React

2.

Third-party libraries

3.

Internal aliases

4.

Relative imports

5.

Styles

Maintain consistent ordering.

---

# Naming

Components

PascalCase

Hooks

useCamelCase

Interfaces

PascalCase

Enums

PascalCase

Files

kebab-case

Folders

lowercase

Constants

UPPER_SNAKE_CASE

---

# Forms

Every form uses

React Hook Form

+

Zod

Never create manual validation.

Validation schemas remain separate.

---

# Styling

TailwindCSS only.

Avoid inline styles.

Avoid CSS Modules.

Avoid styled-components.

Prefer utility classes.

Extract repeated class groups into reusable components.

---

# UI Components

Always prefer

shadcn/ui

Never rebuild components that already exist.

---

# Icons

Lucide React only.

Never mix icon libraries.

---

# Tables

Every table uses

DataTable

component.

Never duplicate table implementations.

---

# Status

Every status uses

StatusBadge

Never manually assign colors.

---

# Timeline

Every procurement workflow uses

Timeline

Never create multiple timeline implementations.

---

# Authentication

AuthProvider

is the only authentication source.

No component may manage authentication directly.

---

# Authorization

Role guards

protect routes.

Do not hide pages solely using conditional rendering.

---

# Error Handling

Never display raw backend errors.

Convert into friendly messages.

Always provide retry actions where possible.

---

# Toasts

Every successful mutation

↓

Success Toast

Every failed mutation

↓

Error Toast

Never silently fail.

---

# Loading

Every async page

must

display Skeletons.

Avoid blank screens.

---

# Empty States

Every collection page requires

EmptyState

Examples

No Requests

No Jobs

No Users

No Payments

---

# Accessibility

Keyboard navigation

Focus indicators

ARIA labels

Accessible dialogs

Proper heading hierarchy

Minimum touch target

44px

Accessibility is mandatory.

---

# Responsive Design

Mobile first.

Desktop enhanced.

Never hide important functionality on mobile.

Tables become cards.

Sidebar becomes drawer.

---

# Performance

Lazy load routes.

Memoize expensive computations.

Avoid unnecessary re-renders.

Avoid large bundle imports.

Use dynamic imports where appropriate.

---

# Security

Never trust frontend validation.

Never expose secrets.

Never hardcode tokens.

Always assume backend validation is authoritative.

---

# Logging

Development

Console logs allowed.

Production

Remove console logs.

Use centralized error handling.

---

# Testing Readiness

Although testing is outside the MVP scope,

the generated architecture must support

Unit Testing

Integration Testing

End-to-End Testing

Avoid tightly coupled code.

---

# Documentation

Every exported hook

Every exported service

Every reusable component

should include concise JSDoc comments describing purpose and usage.

---

# Git Commit Convention

Use Conventional Commits.

Examples

feat:

fix:

refactor:

docs:

style:

test:

build:

chore:

---

# AI Generation Rules

When generating code:

✓ Follow frontend-spec.md

✓ Follow ui-map.md

✓ Follow api-mapping.md

✓ Never invent endpoints

✓ Never invent components

✓ Never generate placeholder business logic

✓ Never skip loading state

✓ Never skip empty state

✓ Never skip error state

✓ Never duplicate components

✓ Prefer reuse over recreation

✓ Generate feature-by-feature

✓ Keep code modular

✓ Keep code fully typed

✓ Ensure ESLint passes

✓ Ensure TypeScript passes

---

# Definition of Done

A feature is considered complete only when:

✓ UI implemented

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ API integrated

✓ Fully typed

✓ Validation complete

✓ Loading state implemented

✓ Empty state implemented

✓ Error state implemented

✓ Toast notifications implemented

✓ React Query configured

✓ Query invalidation implemented

✓ No duplicated logic

✓ No console errors

✓ No TypeScript errors

✓ No ESLint errors

✓ Matches backend API contract

✓ Ready for production