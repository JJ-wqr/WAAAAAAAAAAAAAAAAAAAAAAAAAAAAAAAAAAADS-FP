# Linguiny - AI Language Learning Platform

### Lab Final Project – Web Application Development and Security
Course Code: COMP6703001<br>
Course Name: Web Application Development and Security<br>
Institution: BINUS University International<br>

# Group Information
Group Name: Linguiny

Class: L4BC

### Members
- David Nathanael Halim (2802569346)
- Davin Alexander (2802530653)
- Jeremy Nathanael Gunawan (2802522960)

# Project Information
Project Title: Linguiny – AI-Powered Language Learning Platform <br>
Project Domain: Language Learning Web Application

### Project Description
Linguiny is a web-based language learning application designed to help users improve their language skills through interactive lessons, quizzes, AI-powered conversations, and pronunciation practice.

The platform supports multiple languages and provides personalized learning experiences through adaptive learning mechanisms and AI-generated feedback.

# Architecture Design
## System Architecture
### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Next.js API Routes

### Database
- Firebase Firestore
- PostgreSQL

### Authentication
- Firebase Authentication

### AI Service
- Groq API (Llama 3.3 70B Versatile)

### Deployment
- Docker
- GitHub Actions CI/CD
- CSBIHub Remote Server

## User Requirement Specification (URS)
### Learner
- Register and login securely
- Select preferred learning language
- Access vocabulary, grammar, listening, and speaking lessons
- Complete quizzes and assessments
- Track learning progress
- Set learning goals
- Practice conversations with AI
- Receive AI-generated explanations and feedback

### Admin
- Manage lesson content
- Manage users
- Monitor platform activity
- Maintain learning materials

## Software Requirement Specification (SRS)
### Functional Requirements
#### Authentication
- Users can register accounts.
- Users can login and logout.
- Users can manage profile information.

#### Lessons
- Users can access learning modules.
- Users can study vocabulary.
- Users can study grammar.

#### Quiz System
- Users can answer quizzes.
- The system evaluates answers.
- The system stores quiz results.
- The system provides feedback.

#### Progress Tracking
- Users can view progress statistics.
- Users can view completed lessons.
- Users can monitor achievements.

#### AI Features
- AI generates conversation practice.
- AI explains quiz answers.

### Non-Functional Requirements
#### Performance


#### Security


#### Usability


#### Reliability


# Features (Per Member)
## David Nathanael Halim
### Security Features
- XSS Protection
- API Rate Limiting

### UI/UX
- Responsive Navigation
- User Settings
- Notifications
- Logo Integration
- Sidebar Improvements
- General UI Refinements

### Testing
- Frontend Testing
- Backend API Testing
- Integration Testing
- Security Testing
- AI Functionality Testing

### Deployment & Infrastructure
- Docker Configuration
- CI/CD Pipeline Setup
- GitHub Repository Management
- Production Deployment Preparation

### Additional Features
- Text-to-Speech for Vocabulary Lessons

## Davin Alexander
# AI Implementation
Implementing Groq AI for AI features

# Testing
- Frontend Testing
- Backend API Testing
- Integration Testing
- Security Testing
- AI Functionality Testing
- Authentication Testing
  
# Features
- Added AI Conversation
- Added 4 Languages (Spanish, French, Japanese, Indonesian)
- Added Indonesian pronunciation

- Created Prisma & Swagger API-docs

# Authentication
Create a Google authentication from Firebase & email.


## Jeremy Nathanael Gunawan
# Implemented features:
Architected backend environment management and localized data parsing frameworks.

Configured automated multi-runner test execution workflows via GitHub Actions (cicd.yml).

Built the underlying data validation pipelines for user state synchronization, adaptive performance matrices, and lesson quiz records.

# API endpoints handled:
User Auth/Sync: POST /api/sync-user, GET /api/users/[uid], PUT /api/users/[uid]

Core Core/Quiz: GET /api/lessons, POST /api/quiz/attempt, GET /api/quiz/answers/[attemptId]

#AI Engine: POST /api/ai/chat, POST /api/ai/adaptive-difficulty, POST /api/ai/feedback
# Security work:

Implemented server-side payload sanitizers (sanitizeText(), sanitizeChatMessages()) to neutralize Stored/Reflected XSS vectors and filter custom token properties.

Secured API routing layers against injection attacks and cross-tenant authorization bypasses by validating Firebase sessions against request parameters.

Deployed request rate-limiting controls and HTTP protection headers across high-frequency pathways.

# gAI-related work:

Built integration modules connecting the platform to Groq API services for conversational translation tutoring, adaptive level evaluation, and contextual quiz evaluation.

Engineered systemic defensive controls (prepended isolated system prompts) to prevent prompt injection and mapped secure, deterministic fallback methods (fallbackRecommendation()) to handle api outages or malformed text blocks cleanly.
# Security Implementation
The application implements several security measures:

## Secure Authentication
- Firebase Authentication
- Protected Routes
- Session Management

## Role-Based Access Control
- Learner Role
- Admin Role

## XSS Protection
- Input Sanitization
- Server-side Validation
- Safe Rendering of User Content

## Rate Limiting
- Applied on AI API routes
- Applied on user-generated submissions
- Prevents abuse and excessive requests

# Testing Strategy
## Frontend Testing



## Backend & API Testing



## Integration Testing



## Security Testing


## AI Functionality Testing
