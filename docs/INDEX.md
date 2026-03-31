# Documentation Index

**Last Updated**: 2026-03-31
**Project**: Next.js + Fastify Demo Template

---

## Quick Navigation

### For Project Managers & Product Owners
- Start with: **[Project Overview & PDR](./project-overview-pdr.md)** - Vision, requirements, success metrics
- Then: **[Project Roadmap](./project-roadmap.md)** - Phases, timeline, progress tracking
- Reference: **[System Architecture](./system-architecture.md)** - High-level system design

### For Backend Developers
- Start with: **[Codebase Summary](./codebase-summary.md)** - Server structure and tech stack
- Then: **[Code Standards](./code-standards.md)** - Coding conventions and patterns
- Reference: **[System Architecture](./system-architecture.md)** - API contracts and data models

### For Frontend Developers
- Start with: **[Codebase Summary](./codebase-summary.md)** - Client structure and tech stack
- Then: **[Code Standards](./code-standards.md)** - Component patterns and best practices
- Reference: **[Design Guidelines](./design-guidelines.md)** - UI patterns and component library

### For DevOps & Deployment Engineers
- Start with: **[Deployment Guide](./deployment-guide.md)** - Setup, build, and deploy instructions
- Reference: **[System Architecture](./system-architecture.md)** - Infrastructure overview

### For New Team Members
1. **README.md** (root) - 5-minute project overview
2. **[Project Overview & PDR](./project-overview-pdr.md)** - Understand goals and context
3. **[Codebase Summary](./codebase-summary.md)** - Learn the structure
4. **[Code Standards](./code-standards.md)** - Follow conventions
5. **[System Architecture](./system-architecture.md)** - Understand how pieces fit together
6. **[Design Guidelines](./design-guidelines.md)** - Build consistent UIs

---

## Documentation Files

### [README.md](../README.md)
Quick start guide, project overview, and links to detailed docs.

**Length**: 145 lines | **Audience**: Everyone
**Topics**: Installation, development, deployment, tech stack

---

### [project-overview-pdr.md](./project-overview-pdr.md)
Project vision, Product Development Requirements (PDR), acceptance criteria, and constraints.

**Length**: 255 lines | **Audience**: PMs, stakeholders, architects
**Topics**: Vision, functional requirements, non-functional requirements, success metrics, constraints

---

### [codebase-summary.md](./codebase-summary.md)
Comprehensive overview of project structure, technology choices, and architectural patterns.

**Length**: 369 lines | **Audience**: All developers
**Topics**: Directory structure, technology stack, API contracts, database schema, patterns, performance

---

### [code-standards.md](./code-standards.md)
Coding conventions, naming rules, file organization, error handling, and best practices.

**Length**: 637 lines | **Audience**: All developers
**Topics**: TypeScript rules, naming conventions, file organization, validation, error handling, security, git commits

---

### [system-architecture.md](./system-architecture.md)
Detailed system design, request flows, authentication, data models, and deployment architecture.

**Length**: 603 lines | **Audience**: Architects, senior developers
**Topics**: Architecture diagrams, request flows, auth mechanisms, error handling, monitoring, scalability

---

### [project-roadmap.md](./project-roadmap.md)
Project phases, milestones, timeline, known issues, and resource allocation.

**Length**: 429 lines | **Audience**: PMs, team leads
**Topics**: Phases, timeline, backlog, prioritization, risks, success criteria

---

### [deployment-guide.md](./deployment-guide.md)
Step-by-step deployment instructions for development, staging, and production environments.

**Length**: 700 lines | **Audience**: DevOps, team leads
**Topics**: Local setup, VPS deployment, Docker, Heroku, monitoring, troubleshooting, rollback

---

### [design-guidelines.md](./design-guidelines.md)
UI/UX patterns, component library, accessibility standards, and design system.

**Length**: 780 lines | **Audience**: Frontend developers, designers
**Topics**: Color palette, typography, components, spacing, responsive design, accessibility, forms

---

## File Statistics

| Document | Lines | Type | Last Updated |
|----------|-------|------|--------------|
| README.md | 145 | Quick Start | 2026-03-31 |
| project-overview-pdr.md | 255 | Strategic | 2026-03-31 |
| codebase-summary.md | 369 | Reference | 2026-03-31 |
| code-standards.md | 637 | Guidelines | 2026-03-31 |
| system-architecture.md | 603 | Technical | 2026-03-31 |
| project-roadmap.md | 429 | Planning | 2026-03-31 |
| deployment-guide.md | 700 | Operational | 2026-03-31 |
| design-guidelines.md | 780 | Design | 2026-03-31 |
| **Total** | **3,918** | | |

---

## Technology Stack Quick Reference

### Backend
- **Framework**: Fastify 4.26.0
- **Language**: TypeScript 5.3.3
- **Database**: SQLite + Prisma ORM 5.10.2
- **Auth**: JWT (HS256) + bcrypt
- **Validation**: Zod 4.3.6
- **Security**: Helmet, CORS

### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: TailwindCSS 4
- **Forms**: React Hook Form 7.72.0 + Zod
- **State**: Zustand 5.0.12
- **Data Fetching**: SWR 2.4.1
- **Components**: shadcn/ui, Base UI

---

## Key Concepts

### Authentication Flow
Request → BFF Proxy → Backend JWT Validation → Request.Account Attached → Response → HttpOnly Cookie Set

**See**: [System Architecture > Authentication & Authorization](./system-architecture.md#authentication--authorization)

### Data Fetching Pattern
Server Component Fetch → SWR FallbackData → Client Hydration → Background Revalidation

**See**: [Codebase Summary > Data Fetching Pattern](./codebase-summary.md#data-fetching-pattern)

### Error Handling
Fast-fail Validation → Custom Error Classes → Error Handler Middleware → User-Friendly Response

**See**: [Code Standards > Error Handling](./code-standards.md#error-handling)

### Type Safety
Zod Schemas → API Contracts → TypeScript Types → Discriminated Unions → Exhaustiveness Checking

**See**: [Code Standards > Validation](./code-standards.md#validation)

---

## Common Tasks

### I want to...

**...understand the project**
→ Read [README.md](../README.md) then [Project Overview](./project-overview-pdr.md)

**...set up development environment**
→ Follow [README.md Quick Start](../README.md#quick-start)

**...add a new API endpoint**
→ Review [Codebase Summary > API Contract](./codebase-summary.md#api-contract) and [Code Standards > Naming](./code-standards.md#naming-conventions)

**...create a new component**
→ Check [Design Guidelines > Components](./design-guidelines.md#component-library)

**...fix a bug**
→ Review [Code Standards > Error Handling](./code-standards.md#error-handling)

**...deploy to production**
→ Follow [Deployment Guide](./deployment-guide.md#production-deployment)

**...understand the architecture**
→ Study [System Architecture](./system-architecture.md)

**...check project status**
→ See [Project Roadmap](./project-roadmap.md#milestone-timeline)

---

## Important Links

### Within Project
- **[Root README](../README.md)** - Quick overview
- **[Server Code](../server/)** - Backend source
- **[Client Code](../client/)** - Frontend source
- **[Database Schema](../server/prisma/schema.prisma)** - Data models
- **[Course Lesson Files](../)** - Vietnamese course materials (*.md)

### External References
- [Next.js Documentation](https://nextjs.org/docs)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)

---

## Maintenance & Updates

### Documentation Update Schedule

- **Weekly**: Code standards changes (new patterns)
- **Bi-weekly**: Codebase summary updates (structural changes)
- **Monthly**: Project roadmap progress updates
- **Quarterly**: Architecture review and system design updates
- **As Needed**: Deployment guide, design guidelines, PDR updates

### How to Update

1. Read the relevant doc file
2. Make changes following the existing format
3. Update the "Last Updated" date at top
4. Keep line counts under 800 LOC per file
5. If adding significant content, consider splitting into sub-documents
6. Link to related documents
7. Include table of contents for documents over 300 lines

### File Size Management

All documentation files are designed to stay under ~300 lines per topic. If a file grows beyond this:
1. Identify natural breakpoints (related subtopics)
2. Create index.md in a subdirectory
3. Split content into focused files
4. Link related files together

---

## Version History

### v1.0.0 (2026-03-31)
- Initial documentation complete
- All 8 core documents created
- Project ready for development phase 2

---

## Questions or Issues?

If you find:
- **Outdated information**: Update the file and commit changes
- **Missing documentation**: Create an issue or add to backlog
- **Unclear explanations**: Submit a PR with improvements
- **Broken links**: Fix the link or update the path

---

**Last Updated**: 2026-03-31
**Maintained By**: Documentation Team
**Status**: Complete & Current
