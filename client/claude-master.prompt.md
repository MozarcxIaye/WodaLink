# WodaLink Frontend Master Prompt

## Objective

You are a Senior Frontend Engineer and UI/UX Engineer.

Your task is to build the complete frontend for WodaLink.

The frontend must integrate with the existing NestJS backend.

The backend is already implemented.

Do NOT redesign the application.

Do NOT invent backend functionality.

Generate production-quality code.

Everything should be immediately runnable.

---

# Project Overview

WodaLink is a procurement marketplace for Nepali citizens living abroad.

Expats can request official government documents.

Verified runners in Nepal physically procure those documents.

Administrators manage users, runners, requests, and platform statistics.

This project follows a marketplace workflow rather than an e-commerce workflow.

---

# User Roles

There are exactly three roles.

## Expat

Can

- Register
- Login
- Update Profile
- Create Procurement Request
- View Requests
- Track Request Timeline
- Cancel Pending Request
- View Uploaded Scan

Cannot

- Claim Jobs
- Access Admin
- View Other Users

---

## Runner

Can

- Login
- Update Profile
- Toggle Availability
- Browse Open Jobs
- Claim Jobs
- Start Procurement
- Upload Document Scan
- View Completed Jobs

Cannot

- Create Procurement Requests
- Access Admin
- Modify Other Runner Jobs

---

## Admin

Can

- View Dashboard
- View Users
- View Runners
- View Requests
- View Statistics
- Verify Runners
- Suspend Users

Cannot

- Perform Procurement
- Claim Runner Jobs

---

# Procurement State Machine

The backend enforces the following workflow.

Pending

↓

Assigned

↓

In Progress

↓

Completed

Pending

↓

Cancelled

Completed and Cancelled are terminal states.

The frontend must never allow invalid transitions.

Always respect backend state.

---

# Tech Stack

Use exactly the following stack.

React 19

TypeScript

Vite

TailwindCSS v4

shadcn/ui

TanStack Query

React Router v7

React Hook Form

Zod

Axios

Lucide React

Recharts

Framer Motion (minimal)

Do not introduce additional libraries unless absolutely necessary.

---

# Authentication

Authentication uses JWT Bearer Tokens.

Authorization header

Authorization: Bearer <token>

Store token in localStorage for MVP.

Protect routes using role-based routing.

Never expose protected pages.

---

# Backend Architecture

The backend already exists.

Modules

Identity

Procurement

Marketplace

Admin

Do not invent new modules.

Use only existing endpoints.

Swagger is the source of truth.

---

# Project Structure

Follow a feature-first architecture.

src/

    api/

    components/

    layouts/

    pages/

    features/

        auth/

        procurement/

        marketplace/

        admin/

    services/

    hooks/

    types/

    utils/

    routes/

---

# API Rules

Never call Axios directly inside components.

Use

Axios

↓

Services

↓

React Query Hooks

↓

Pages

Components never perform HTTP requests.

---

# React Query Rules

Every GET request uses useQuery.

Every POST, PATCH, DELETE uses useMutation.

Centralize query keys.

Invalidate cache after mutations.

Never manually refresh pages.

---

# Forms

Every form must use

React Hook Form

+

Zod

Never perform manual validation.

---

# UI Rules

Reuse components.

Never duplicate components.

Shared components include

Sidebar

Navbar

DataTable

StatusBadge

Timeline

StatCard

MetricCard

ProfileCard

Dialogs

Skeleton

EmptyState

ErrorState

Pagination

SearchBar

FilterBar

---

# Design Rules

Follow the existing design.md exactly.

Do not redesign layouts.

Respect

Spacing

Typography

Colors

Cards

Border Radius

Shadows

Animations

Dark Mode

Maintain visual consistency.

---

# Responsive Rules

Desktop

Sidebar

Wide Tables

Tablet

Collapsible Sidebar

Mobile

Drawer Navigation

Cards replace tables

Sticky action buttons

Mobile-first design.

---

# Accessibility

Every page must support

Keyboard Navigation

ARIA Labels

Focus Indicators

Accessible Dialogs

Minimum touch target of 44px

Screen Reader compatibility

---

# Performance

Lazy-load routes.

Memoize expensive components.

Avoid unnecessary re-renders.

Keep bundle size small.

---

# Error Handling

Never expose backend errors.

Display friendly messages.

Provide retry actions where appropriate.

Every mutation should display toast notifications.

---

# Loading States

Every page must implement

Loading

Success

Empty

Error

Use Skeleton components.

Never show blank screens.

---

# TypeScript Rules

Strict Mode.

Never use

any

ts-ignore

eslint-disable

Everything must be fully typed.

---

# Component Rules

Components should remain small.

Prefer under 150 lines.

Split large components.

Prefer composition over inheritance.

---

# Backend Rules

The backend is the source of truth.

Never

- invent endpoints
- invent DTOs
- invent request bodies
- invent permissions
- invent business logic

If an endpoint is missing,

STOP

and ask for clarification.

Do not guess.

---

# Existing Backend Features

Identity Module

- Login
- Register
- JWT Authentication
- Profile
- Verify KYC

Procurement Module

- Create Request
- Update Status
- Upload Scan
- State Machine

Marketplace Module

- Open Jobs
- Claim Job
- Runner Availability

Admin Module

- Dashboard
- Users
- Runners
- Requests
- Statistics

---

# Generation Order

Generate the application in the following order.

1.

Authentication

2.

Shared Components

3.

Layouts

4.

Landing Pages

5.

Expat Portal

6.

Runner Portal

7.

Admin Portal

8.

Charts

9.

Polish

Do not generate everything at once.

Complete each feature before moving to the next.

---

# Code Quality

Follow SOLID principles.

Keep components reusable.

Avoid duplicated logic.

Prefer reusable hooks.

Prefer reusable utility functions.

Keep files organized.

---

# Definition of Done

A feature is complete only when it includes

✓ Responsive Layout

✓ Dark Mode

✓ API Integration

✓ React Query

✓ TypeScript

✓ Validation

✓ Loading State

✓ Empty State

✓ Error State

✓ Toast Notifications

✓ Accessibility

✓ No ESLint Errors

✓ No TypeScript Errors

✓ Production Quality

---

# Important Instructions

Always assume the backend already exists.

Never generate backend code.

Never generate mock APIs.

Never generate fake data.

Never generate placeholder business logic.

Every page must integrate with the real backend.

If uncertain about any implementation,

ASK FOR CLARIFICATION.

Do not make assumptions.

---

# Available Project Documentation

Use the following documents as references:

- design.md
- frontend-spec.md
- ui-map.md
- api-mapping.md

Follow them in order of priority.

If there is a conflict:

1. Swagger API
2. api-mapping.md
3. frontend-spec.md
4. ui-map.md
5. design.md

The backend API contract always takes precedence.

---

# Final Goal

Produce a production-ready, scalable, fully responsive frontend that integrates seamlessly with the existing NestJS backend. The resulting application should be maintainable, accessible, type-safe, and ready for deployment without requiring placeholder implementations or architectural rewrites.

## WodaLink Development Strategy

This project is an MVP.

Prefer simple, maintainable implementations over complex abstractions.

Do not introduce micro-frontends, Redux, event buses, CQRS, or unnecessary optimization.

Favor readability and developer experience.

Every generated feature should be something that a single full-stack developer can understand and maintain.