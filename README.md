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


# System Architecture
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
- Groq API

# Features (Per Member)
## David Nathanael Halim
### Security Features
- XSS Protection
- API Rate Limiting

### UI/UX
- Responsive Navigation
- User Settings
- Notifications

## Davin Alexander



## Jeremy Nathanael Gunawan


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




