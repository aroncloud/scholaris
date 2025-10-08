# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scholaris is a comprehensive university management system built with Next.js 15, React 19, and TypeScript. It manages students, teachers, courses, attendance, grades, planning/scheduling, and administrative operations for educational institutions.

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture & Core Patterns

### Route Groups & Authentication

The application uses Next.js App Router with route groups for access control:

- `(auth)/` - Authentication pages (login, signup)
- `(admin)/dashboard/` - Protected admin/teacher dashboard pages
- `(website)/` - Public-facing website pages

**Session Management**: Uses `jose` library for JWT-based sessions with HTTP-only cookies. Session verification happens in server actions via `verifySession()` from `src/lib/session.ts`.

### Server Actions Pattern

All API interactions use Next.js Server Actions (not REST endpoints):

- **Location**: `src/actions/` directory
- **Pattern**: Each action calls backend microservices using axios
- **Auth**: Every action calls `verifySession()` to get the user's access token
- **Error Handling**: Centralized via `actionErrorHandler()` in `src/actions/errorManagement.ts`
- **Response Format**: `{ code: 'success' | 'error', data?: any, error?: string }`

Example:
```typescript
export async function getStudents() {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const response = await axios.get(`${process.env.STUDENT_WORKER_ENDPOINT}/api/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}
```

### State Management with Zustand

Global state is managed with Zustand stores in `src/store/`:

- `useAuthStore` - User authentication and session
- `useAcademicYearStore` - Academic year selection (critical for filtering)
- `useFactorizedProgramStore` - Programs and curriculums
- `useTeacherStore` - Teacher data
- `useClassroomStore` - Classroom/resource data
- `studentStore` - Student data

**Key Pattern**: Many features use `selectedAcademicYear` from `useAcademicYearStore` to filter data. Always use `getCurrentAcademicYear()` when you need the current academic year context.

### Custom Hooks for Feature Data

Complex features use custom hooks to centralize data management:

- **Location**: `src/hooks/feature/{feature-name}/`
- **Purpose**: Encapsulate data fetching, state management, loading/error states
- **Pattern**: Return data, loading states, error states, and action functions
- **Example**: `useAbsenceData` (see `src/hooks/feature/attendance/useAbsenceData.ts`)

When building new features with complex state, create a custom hook following this pattern.

### Type System

TypeScript types are organized by domain in `src/types/`:

- `planificationType.ts` - Schedules, sessions, sequences
- `absenceTypes.ts` - Attendance and justifications
- `programTypes.ts` - Programs, curriculums, UEs (teaching units)
- `gradeTypes.ts` - Grades and evaluations
- `authTypes.ts` - Session and user authentication
- etc.

**Important Interfaces**:
- `IGetSchedule` - Session/schedule data with teacher and resource info
- `ICreateSession` - Creating course sessions (requires `academic_year_code`, `curriculum_code`)
- `IGetAbsencesListRequest` - Querying absences (note the typo: `curriculumn_code`)

### Forms & Validation

Forms use `react-hook-form` with these patterns:

- `useForm()` with TypeScript interfaces for type safety
- `Controller` for complex UI components (Select, DatePicker, etc.)
- `useWatch()` to react to field changes
- `setValue()` for programmatic updates
- **Date Handling**: Store as ISO strings (`YYYY-MM-DDTHH:mm:ss`), append `Z` when sending to backend

**Common Pattern - Date Synchronization**:
When the start date changes, automatically update the end date to match (keeping the time):
```typescript
useEffect(() => {
  if (startTime) {
    const [startDate] = startTime.split('T');
    if (endTime) {
      const [, endTimeOnly] = endTime.split('T');
      setValue('end_time', `${startDate}T${endTimeOnly}`);
    }
  }
}, [startTime, setValue]);
```

### Modal Dialogs

Dialogs use Radix UI Dialog primitives with consistent patterns:

- `DialogCreateX` - For creating new records
- `DialogUpdateX` - For editing existing records
- **Pre-filling**: When opening edit modals, populate fields from `extendedProps` or data objects
- **Read-only fields**: Use `disabled` prop with `bg-muted` class for visual distinction

### FullCalendar Integration

Course planning uses FullCalendar with custom event mapping:

- Convert backend data via `convertIntoFullCalendarFormat()`
- Store extra data in `extendedProps` (curriculum_code, course_unit_code, schedule_code, etc.)
- Display names are mapped separately (classroom names, teacher names) from the codes stored in extendedProps
- Curriculum code is passed from page filters into calendar events for context

## Key Business Logic

### Academic Years & Filtering

Almost all data queries require an academic year context:
- Use `useAcademicYearStore.getCurrentAcademicYear()` to get current year
- Filter schedules, grades, enrollments by `academic_year_code`
- The academic year selector in the UI sets the global filter context

### Programs, Curriculums, and UEs

Hierarchical structure:
- **Program** → **Curriculum** (filière) → **Course Unit (UE)** → **Sessions**
- Sessions are scheduled teaching events for a specific UE
- Use `getListAcademicYearsSchedulesForCurriculum()` to get schedules/sequences for a curriculum
- Use `getUEListPerCurriculum()` to get teaching units for a curriculum

### Attendance & Absences

- **Absence Recording**: Mark students absent in sessions via `recordAbsences()`
- **Justifications**: Students submit justifications with documents
- **Review Flow**: Teachers/admins review justifications via `reviewJustification(status, justification_code, reason)`
- Status flow: `PENDING_REVIEW` → `APPROVED` | `REJECTED`

## UI Components & Styling

### Component Library

Uses shadcn/ui (Radix UI primitives) with Tailwind CSS:
- Components in `src/components/ui/`
- Custom toast system via `showToast()` from `src/components/ui/showToast`
- Responsive tables via `ResponsiveTable` component

### Styling Conventions

- Tailwind utility classes with semantic color system
- Status colors: `bg-green-*` (success), `bg-red-*` (error), `bg-blue-*` (info)
- Muted backgrounds for disabled/read-only fields: `bg-muted`
- French locale for dates: use `date-fns` with proper formatting

### Layout Components

- `PageHeader` - Consistent page title and description
- `ContentLayout` - Card-based content sections with optional icons

## Environment Variables

Required environment variables for backend microservices:
- `ATTENDACE_WORKER_ENDPOINT` - Attendance service (note typo in var name)
- `TIMETABLE_WORKER_ENDPOINT` - Scheduling service
- `STUDENT_WORKER_ENDPOINT` - Student service
- `AUTH_SECRET` - JWT secret for session encryption

## Common Pitfalls & Solutions

### Form Date Handling
- Always validate end date/time >= start date/time before submission
- Use `setValue(..., { shouldValidate: false })` to prevent validation loops during synchronization
- Append 'Z' to ISO strings when sending to backend for timezone consistency

### Pre-filling Edit Forms
- Use `useEffect` with `open` dependency to load data when modal opens
- Extract codes from `extendedProps` not display names
- Load dependent data (UEs, schedules) based on selected curriculum

### Calendar Events
- Store all necessary codes in `extendedProps` (not just display names)
- Map display names separately for rendering
- Pass curriculum context from page-level filters

### Server Action Errors
- Always use `actionErrorHandler()` for consistent error formatting
- Check `result.code === 'success'` before accessing `result.data`
- Display errors via `showToast({ variant: 'error-solid', ... })`

## Testing & Debugging

- Console logs are acceptable during development (many exist in codebase)
- Use `console.log` to debug server action responses
- Check browser Network tab for axios calls to backend services

## Code Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use `const` for components and functions
- Disable ESLint rules when necessary with `/* eslint-disable */` comments
- French language for UI text and comments (this is a francophone system)

## Performance Optimization

- Use `useMemo` for expensive computations (curriculum lists, table columns)
- Use `useCallback` for functions passed to child components
- Avoid re-fetching data unnecessarily - leverage custom hooks for caching
- Only load data when modals/dialogs open (check `open` dependency)
