# NestJS Helpdesk Ticket API

A RESTful Helpdesk Ticket Management API built with **NestJS**.

This project demonstrates the core concepts of NestJS by building a practical ticket management system, including controllers, services, dependency injection, DTO validation, pipes, middleware, guards, interceptors, filtering, and the NestJS request lifecycle.

## Features

* Create support tickets
* Get all tickets
* Get a ticket by ID
* Filter tickets using query parameters
* Update existing tickets
* Close tickets
* Prevent invalid updates to closed tickets
* DTO-based request validation
* Global request validation
* Automatic removal of unknown request properties
* Request logging middleware
* Staff authorization using Guards
* Standardized API responses using Interceptors
* Global API prefix
* RESTful API architecture

## Tech Stack

* Node.js
* NestJS
* TypeScript
* class-validator
* class-transformer

## Project Setup

Install the dependencies:

```bash
npm install
```

Run the application in development mode:

```bash
npm run start:dev
```

Run the application:

```bash
npm run start
```

Build the application:

```bash
npm run build
```

## Global API Prefix

The application uses a global API prefix:

```typescript
app.setGlobalPrefix('api');
```

This means API routes are accessed through:

```text
/api/...
```

For example:

```text
GET /api/tickets
```

## Ticket Model

A ticket contains information such as:

```json
{
  "id": 1,
  "priority": "high",
  "title": "Unable to Access Employee Dashboard",
  "description": "Users are unable to access the employee dashboard after logging in.",
  "status": "open",
  "createdAt": "2026-09-13T05:30:00.000Z"
}
```

Typical ticket priorities:

```text
low
medium
high
```

Typical ticket statuses:

```text
open
in-progress
closed
```

## API Endpoints

### Get All Tickets

```http
GET /api/tickets
```

Example response:

```json
[
  {
    "id": 1,
    "priority": "high",
    "title": "Unable to Access Employee Dashboard",
    "description": "Users are unable to access the employee dashboard after logging in.",
    "status": "open"
  }
]
```

### Get Ticket by ID

```http
GET /api/tickets/1
```

NestJS `ParseIntPipe` is used to convert and validate the ticket ID.

Example:

```typescript
@Param('id', ParseIntPipe) id: number
```

An invalid ID such as:

```text
/api/tickets/abc
```

will automatically result in a validation error.

## Filter Tickets

Tickets can be filtered using query parameters.

Example:

```http
GET /api/tickets?status=open
```

Another example:

```http
GET /api/tickets?priority=high
```

Query parameters can be accessed using:

```typescript
@Query()
```

## Create Ticket

```http
POST /api/tickets
```

Example request body:

```json
{
  "priority": "high",
  "title": "Application Crashes When Starting Tracker",
  "description": "The desktop application crashes immediately when the user starts the tracker."
}
```

### CreateTicketDto

Incoming ticket data is validated using a DTO.

Example:

```typescript
export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['low', 'medium', 'high'])
  priority: string;
}
```

This prevents invalid data from entering the application.

## Global ValidationPipe

Validation is configured globally in `main.ts`.

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
```

With `whitelist: true`, properties that aren't defined in the DTO are automatically removed.

For example:

```json
{
  "title": "Login issue",
  "description": "Unable to login",
  "priority": "high",
  "isAdmin": true
}
```

If `isAdmin` isn't part of `CreateTicketDto`, it won't be passed to the application logic.

## Update Ticket

Existing tickets can be updated using `PATCH`.

```http
PATCH /api/tickets/1
```

Example request:

```json
{
  "priority": "medium",
  "title": "Updated Ticket Title"
}
```

### UpdateTicketDto

The update DTO allows partial updates.

```typescript
export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
```

This makes the properties from `CreateTicketDto` optional when updating a ticket.

## Close Ticket

A ticket can be moved to the closed state.

Example:

```http
PATCH /api/tickets/1
```

```json
{
  "status": "closed"
}
```

The application also implements business rules around closed tickets.

Once a ticket is closed, certain modifications can be prevented to protect the final state of the ticket.

## Dependency Injection

Business logic is separated from HTTP handling using `TicketsService`.

The controller receives the service through NestJS dependency injection.

```typescript
constructor(
  private readonly ticketsService: TicketsService,
) {}
```

This keeps responsibilities separated:

```text
Controller
    ↓
Service
    ↓
Ticket Data / Business Logic
```

The **Controller** handles HTTP requests and responses.

The **Service** contains ticket-related business logic.

## Request Logging Middleware

Middleware is used to log incoming HTTP requests before they reach the controller.

Typical request flow:

```text
Client Request
      ↓
Middleware
      ↓
Guard
      ↓
Controller
      ↓
Service
```

Logging middleware can capture information such as:

```text
GET /api/tickets
POST /api/tickets
PATCH /api/tickets/1
```

## StaffGuard

Authorization is implemented using a NestJS Guard.

The `StaffGuard` determines whether a request is allowed to access protected functionality.

Example:

```typescript
@UseGuards(StaffGuard)
```

Guards run before the controller method and can either allow or reject the request.

```text
Request
   ↓
StaffGuard
   ↓
Authorized?
  ↙       ↘
Yes       No
 ↓         ↓
Controller 403 Forbidden
```

## Success Response Interceptor

A NestJS Interceptor is used to provide a consistent response structure.

Instead of returning:

```json
{
  "id": 1,
  "title": "Login Issue"
}
```

the API can return a standardized response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Login Issue"
  }
}
```

This keeps API responses consistent across different endpoints.

## NestJS Request Lifecycle

One of the key concepts covered by this project is the NestJS request lifecycle.

A simplified lifecycle looks like this:

```text
Incoming HTTP Request
        ↓
Middleware
        ↓
Guards
        ↓
Interceptors (Before)
        ↓
Pipes
        ↓
Controller
        ↓
Service
        ↓
Controller Response
        ↓
Interceptors (After)
        ↓
HTTP Response
```

Each component has a different responsibility.

| Component   | Responsibility                                               |
| ----------- | ------------------------------------------------------------ |
| Middleware  | Runs before route handling and can inspect requests          |
| Guard       | Determines whether the request is authorized                 |
| Pipe        | Validates or transforms incoming data                        |
| Controller  | Handles HTTP routes                                          |
| Service     | Contains business logic                                      |
| Interceptor | Wraps request/response execution and can transform responses |

## Key NestJS Concepts Learned

After completing this project, you should understand how the following NestJS concepts work together:

```text
Modules
Controllers
Services
Dependency Injection
DTOs
Validation
Pipes
Middleware
Guards
Interceptors
REST APIs
Query Parameters
Route Parameters
Business Rules
Request Lifecycle
```

## Project Goal

The main goal of this project is to build a ticket API while understanding the architecture behind a NestJS application.

By the end of the project, the complete request flow becomes clear:

```text
HTTP Request
    ↓
Middleware
    ↓
Authorization Guard
    ↓
Validation / Pipes
    ↓
Controller
    ↓
Service
    ↓
Business Logic
    ↓
Interceptor
    ↓
HTTP Response
```

This provides a solid foundation for building larger NestJS applications with databases, authentication, role-based authorization, and production-ready API architecture.
