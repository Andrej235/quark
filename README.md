# Quark Desktop Application Design Document

## 1. Overview

### 1.1 Purpose

This document outlines the design and development plan for **Quark**, a desktop application to assist individual freelancers and teams (organizations and companies) in finding clients through cold email outreach. It serves as a shared reference for the development team to ensure alignment during the 6-week MVP development.

### 1.2 Scope

Quark is a cross-platform, online-only desktop application targeting Windows, macOS, and Linux distributions. It enables users to manage prospects, collaborate on email outreach, leverage AI for email optimization, and scrape web data for prospect enrichment. The app is premium-only, prioritizing a seamless user experience and robust security.

### 1.3 Goals

- Streamline prospect management with customizable data structures.
- Facilitate real-time team collaboration for email drafting and prospect data.
- Integrate AI-driven email suggestions and scheduling.
- Support web scraping for prospect data enrichment.
- Ensure cross-platform compatibility and secure data handling.

## 2. Requirements

### 2.1 Functional Requirements

- **Prospect Management**:
  - Add, edit, and delete prospect profiles.
  - Customize data templates (e.g., fields for name, company, email, industry) with flexibility to modify structure per prospect.
  - Store and retrieve prospect data in Postgres.
- **Email Management**:
  - Collaborate in real-time on email drafts with team members.
  - Use AI to suggest email improvements (e.g., tone, content, subject lines).
  - Schedule emails with AI-driven timing suggestions.
  - Send desktop notifications for scheduled emails (e.g., "Time to send email to Prospect X").
- **Team Collaboration**:
  - Real-time updates for prospect data and email drafts across team members.
  - Support concurrent editing with conflict resolution (e.g., last-saved changes).
- **Web Scraping**:
  - Scrape public web data (e.g., LinkedIn, company websites) to enrich prospect profiles.
  - Allow users to trigger and review scraped data within the app.

### 2.2 Non-Functional Requirements

- **Compatibility**: Support Windows 10+, macOS 10.15+, and major Linux distributions.
- **Scalability**: Handle up to 1,000 prospects per team for the MVP, with efficient database queries.
- **Usability**: Intuitive UI with minimal learning curve, leveraging Shadcn components for consistency.
- **Performance**: App should load in under 3 seconds; API responses within 1 second.
- **Online-Only**: Requires internet connectivity for all operations (data sync, AI, scraping).

## 3. System Architecture

### 3.1 Technology Stack

- **Frontend**:
  - Tauri (Rust-based, lightweight alternative to Electron for cross-platform desktop apps).
  - React with TypeScript for UI components.
  - Tailwind CSS for styling.
  - React Query for data fetching and caching.
  - Shadcn for reusable UI components.
  - Zustand for state management.
  - Motion (Framer Motion) for animations.
- **Backend**: Rust with Actix Web for API server and business logic.
- **Database**: Postgres for storing prospect and email data.
- **AI and Scraping**: To be determined (placeholder for external AI service and scraping library).
- **Collaboration Tools**: GitHub for version control, Notion for team communication.

### 3.2 Data Flow

1. User interacts with React-based UI to manage prospects, emails, or their teams.
2. Tauri frontend communicates with Rust backend via a REST API.
3. Backend processes requests, interacts with Postgres for data storage/retrieval.
4. AI service (TBD) provides email suggestions and scheduling recommendations.
5. Web scraping module (TBD) fetches and processes prospect data, storing results in Postgres.
6. Real-time collaboration syncs data via WebSocket or polling through the Actix backend.

## 4. User Interface Details

### 4.1 Navigation

- Sidebar navigation for quick access to Prospects, Emails, and Settings.
- Keyboard shortcuts (e.g., Ctrl+P for new prospect, Ctrl+E for new email).
- Breadcrumb navigation for nested views (e.g., Prospect > Profile > Edit).

### 4.2 Theme and Styling

- Light and dark themes using Tailwind CSS.
- Smooth animations (e.g., modal transitions, list updates) via Framer Motion.
- Consistent UI with Shadcn components for buttons, forms, and tables.

## 5. Security Considerations

- **Authentication**: Implement JWT and refresh tokens for user sessions.
- **Input Validation**: Sanitize all user inputs in Actix to prevent injection attacks.
- **Scraping Compliance**: Ensure scraping adheres to legal and ethical guidelines (e.g., respect robots.txt).
