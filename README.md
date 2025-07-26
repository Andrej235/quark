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

## 2. Team and Collaboration

- **Team**: Four developers with fluid roles, collaborating via Notion for communication and task tracking
- **Repository**: Hosted on GitHub
- **Workflow**: Use GitHub for version control, pull requests, and code reviews; Notion for discussions and sprint planning

## 3. Requirements

### 3.1 Functional Requirements

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

### 3.2 Non-Functional Requirements

- **Compatibility**: Support Windows 10+, macOS 10.15+, and major Linux distributions.
- **Scalability**: Handle up to 1,000 prospects per team for the MVP, with efficient database queries.
- **Usability**: Intuitive UI with minimal learning curve, leveraging Shadcn components for consistency.
- **Performance**: App should load in under 3 seconds; API responses within 1 second.
- **Online-Only**: Requires internet connectivity for all operations (data sync, AI, scraping).

## 4. System Architecture

### 4.1 Technology Stack

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

### 4.2 Data Flow

1. User interacts with React-based UI to manage prospects, emails, or their teams.
2. Tauri frontend communicates with Rust backend via a REST API.
3. Backend processes requests, interacts with Postgres for data storage/retrieval.
4. AI service (TBD) provides email suggestions and scheduling recommendations.
5. Web scraping module (TBD) fetches and processes prospect data, storing results in Postgres.
6. Real-time collaboration syncs data via WebSocket or polling through the Actix backend.

## 5. User Interface Design

### 5.1 Mockups

- **Main Window**: Split layout with sidebar (Prospects, Emails, Settings) and main panel (prospect list, email editor, or scraped data view).
- **Prospect List View**: Table with customizable columns (e.g., name, email, company, custom fields), filterable and sortable.
- **Email Editor**: Collaborative text editor with AI suggestion panel (e.g., "Improve tone", "Suggest subject").
- **Prospect Profile**: Form for editing prospect data, with sections for scraped data and custom fields.
- **Settings**: Options for template customization and notification preferences.

### 5.2 Navigation

- Sidebar navigation for quick access to Prospects, Emails, and Settings.
- Keyboard shortcuts (e.g., Ctrl+P for new prospect, Ctrl+E for new email).
- Breadcrumb navigation for nested views (e.g., Prospect > Profile > Edit).

### 5.3 Theme and Styling

- Light and dark themes using Tailwind CSS.
- Smooth animations (e.g., modal transitions, list updates) via Framer Motion.
- Consistent UI with Shadcn components for buttons, forms, and tables.

## 6. Development Plan

### 6.1 Phases (6-Week MVP Timeline)

1. **Week 1**: Set up Tauri, React, Actix, and Postgres; setup the basic workflow.
2. **Week 2**: Implement JWT based authentication, and develop basic team management features.
3. **Week 3**: Built out prospect management, and notification system.
4. **Week 4**: Create email editor, and real-time collaboration features.
5. **Week 5**: Polish UI, and implement AI email suggestions and scheduling.
6. **Week 6**: Implement web scraping (placeholder library) and notification system.

### 6.2 Collaboration

- **GitHub**: Use branches for features, pull requests for reviews, and main branch for stable code.
- **Notion**: Document sprint goals, track tasks, and store meeting notes.
- **Weekly Syncs**: Review progress, update design document, and assign tasks.

## 7. Security Considerations

- **Authentication**: Implement JWT and refresh tokens for user sessions.
- **Input Validation**: Sanitize all user inputs in Actix to prevent injection attacks.
- **Scraping Compliance**: Ensure scraping adheres to legal and ethical guidelines (e.g., respect robots.txt).
