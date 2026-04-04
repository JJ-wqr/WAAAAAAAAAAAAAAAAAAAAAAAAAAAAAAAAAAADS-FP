import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "Linguiny API",
    version: "1.0.0",
    description:
      "REST API documentation for the Linguiny language learning platform. Supports Japanese, English, Spanish, and French.",
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    { name: "Users", description: "User management and synchronization" },
    { name: "Sessions", description: "Active login session management" },
    { name: "Quiz", description: "Quiz attempts and answer history" },
    { name: "Lessons", description: "Lesson content and curriculum" },
    { name: "Flashcards", description: "Flashcard decks per language" },
    { name: "Vocabulary", description: "Vocabulary bank per language" },
    { name: "Leaderboard", description: "Global user rankings" },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "abc123xyz" },
          email: { type: "string", format: "email", example: "user@example.com" },
          name: { type: "string", nullable: true, example: "John Doe" },
          image: { type: "string", nullable: true, example: "https://example.com/photo.jpg" },
          emailVerified: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Flashcard: {
        type: "object",
        properties: {
          front: { type: "string", example: "食べる" },
          hint: { type: "string", example: "taberu" },
          back: { type: "string", example: "to eat" },
          example: { type: "string", example: "私は毎日ご飯を食べる。" },
        },
      },
      VocabWord: {
        type: "object",
        properties: {
          word: { type: "string", example: "食べる" },
          romaji: { type: "string", example: "taberu" },
          meaning: { type: "string", example: "to eat" },
          category: { type: "string", enum: ["Nouns", "Verbs", "Adjectives"] },
          mastery: { type: "number", example: 90 },
          known: { type: "boolean", example: true },
        },
      },
      LessonMeta: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          title: { type: "string", example: "Hello & Goodbye" },
          duration: { type: "string", example: "5 min" },
          xp: { type: "number", example: 10 },
          unit: { type: "number", example: 1 },
          unitTitle: { type: "string", example: "Basics & Greetings" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Not found" },
        },
      },
      Session: {
        type: "object",
        properties: {
          id: { type: "string", example: "clx1..." },
          userId: { type: "string", example: "abc123xyz" },
          token: { type: "string", example: "tok_..." },
          expiresAt: { type: "string", format: "date-time" },
          ipAddress: { type: "string", nullable: true, example: "192.168.1.1" },
          userAgent: { type: "string", nullable: true, example: "Mozilla/5.0..." },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      QuizAnswer: {
        type: "object",
        properties: {
          id: { type: "string" },
          attemptId: { type: "string" },
          questionIndex: { type: "integer", example: 0 },
          selectedOption: { type: "integer", example: 2 },
          isCorrect: { type: "boolean", example: true },
        },
      },
      QuizAttempt: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string", example: "abc123xyz" },
          lessonId: { type: "integer", example: 1 },
          lang: { type: "string", example: "ja" },
          score: { type: "number", example: 90 },
          xpEarned: { type: "integer", example: 10 },
          completedAt: { type: "string", format: "date-time" },
          answers: { type: "array", items: { $ref: "#/components/schemas/QuizAnswer" } },
        },
      },
    },
  },
  paths: {
    "/api/sync-user": {
      post: {
        tags: ["Users"],
        summary: "Sync Firebase user to database",
        description:
          "Creates or updates a user record in the database after Firebase authentication. Called automatically on login and registration.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["uid", "email"],
                properties: {
                  uid: { type: "string", example: "abc123xyz" },
                  email: { type: "string", format: "email", example: "user@example.com" },
                  name: { type: "string", nullable: true, example: "John Doe" },
                  image: { type: "string", nullable: true, example: "https://example.com/photo.jpg" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User successfully synced",
            content: {
              "application/json": {
                schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/users/{uid}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        description: "Returns the database record for a specific user by their Firebase UID.",
        parameters: [
          { name: "uid", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
        ],
        responses: {
          "200": {
            description: "User found",
            content: {
              "application/json": {
                schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
              },
            },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user profile",
        description: "Updates the name or profile image of an existing user.",
        parameters: [
          { name: "uid", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Jane Doe" },
                  image: { type: "string", example: "https://example.com/new-photo.jpg" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
              },
            },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        description: "Permanently deletes a user and all associated sessions from the database.",
        parameters: [
          { name: "uid", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
        ],
        responses: {
          "200": {
            description: "User deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", example: "User deleted successfully" } },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/users/{uid}/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "List user sessions",
        description: "Returns all active login sessions for a specific user.",
        parameters: [
          { name: "uid", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
        ],
        responses: {
          "200": {
            description: "List of sessions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sessions: { type: "array", items: { $ref: "#/components/schemas/Session" } },
                    total: { type: "integer", example: 2 },
                  },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/sessions/{sessionId}": {
      delete: {
        tags: ["Sessions"],
        summary: "Revoke a session",
        description: "Permanently deletes a specific session, logging the user out of that device.",
        parameters: [
          { name: "sessionId", in: "path", required: true, schema: { type: "string" }, example: "clx1..." },
        ],
        responses: {
          "200": {
            description: "Session revoked",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", example: "Session revoked successfully" } },
                },
              },
            },
          },
          "404": {
            description: "Session not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/quiz/attempt": {
      post: {
        tags: ["Quiz"],
        summary: "Submit a quiz attempt",
        description: "Records a completed quiz attempt with score, XP earned, and individual answers.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "lessonId", "lang", "score", "xpEarned"],
                properties: {
                  userId: { type: "string", example: "abc123xyz" },
                  lessonId: { type: "integer", example: 1 },
                  lang: { type: "string", enum: ["ja", "en", "es", "fr"], example: "ja" },
                  score: { type: "number", description: "Score percentage (0–100)", example: 90 },
                  xpEarned: { type: "integer", example: 10 },
                  answers: {
                    type: "array",
                    description: "Optional — individual question responses",
                    items: {
                      type: "object",
                      properties: {
                        questionIndex: { type: "integer", example: 0 },
                        selectedOption: { type: "integer", example: 2 },
                        isCorrect: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Attempt recorded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { attempt: { $ref: "#/components/schemas/QuizAttempt" } },
                },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/quiz/attempts/{userId}": {
      get: {
        tags: ["Quiz"],
        summary: "Get user's quiz history",
        description: "Returns all quiz attempts for a user, optionally filtered by language.",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"] },
            description: "Filter by language",
          },
        ],
        responses: {
          "200": {
            description: "Quiz attempt history",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    attempts: { type: "array", items: { $ref: "#/components/schemas/QuizAttempt" } },
                    total: { type: "integer", example: 5 },
                  },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/quiz/attempts/{userId}/{lessonId}": {
      get: {
        tags: ["Quiz"],
        summary: "Get attempts for a specific lesson",
        description: "Returns all attempts a user has made on a specific lesson, newest first.",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" }, example: "abc123xyz" },
          { name: "lessonId", in: "path", required: true, schema: { type: "integer" }, example: 1 },
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"] },
            description: "Filter by language",
          },
        ],
        responses: {
          "200": {
            description: "Attempts for the lesson",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    attempts: { type: "array", items: { $ref: "#/components/schemas/QuizAttempt" } },
                    total: { type: "integer", example: 3 },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/quiz/attempt/{attemptId}": {
      get: {
        tags: ["Quiz"],
        summary: "Get a specific attempt",
        description: "Returns a single quiz attempt by its ID, including all individual answers.",
        parameters: [
          { name: "attemptId", in: "path", required: true, schema: { type: "string" }, example: "clx1..." },
        ],
        responses: {
          "200": {
            description: "Quiz attempt with answers",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { attempt: { $ref: "#/components/schemas/QuizAttempt" } },
                },
              },
            },
          },
          "404": {
            description: "Attempt not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
      delete: {
        tags: ["Quiz"],
        summary: "Delete a quiz attempt",
        description: "Permanently deletes a quiz attempt and all its associated answers.",
        parameters: [
          { name: "attemptId", in: "path", required: true, schema: { type: "string" }, example: "clx1..." },
        ],
        responses: {
          "200": {
            description: "Attempt deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", example: "Attempt deleted successfully" } },
                },
              },
            },
          },
          "404": {
            description: "Attempt not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/quiz/answers/{attemptId}": {
      get: {
        tags: ["Quiz"],
        summary: "Get answers for an attempt",
        description: "Returns all individual question answers for a quiz attempt, ordered by question index. Also returns correct/incorrect counts.",
        parameters: [
          { name: "attemptId", in: "path", required: true, schema: { type: "string" }, example: "clx1..." },
        ],
        responses: {
          "200": {
            description: "Answers with summary stats",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    answers: { type: "array", items: { $ref: "#/components/schemas/QuizAnswer" } },
                    total: { type: "integer", example: 10 },
                    correct: { type: "integer", example: 9 },
                    incorrect: { type: "integer", example: 1 },
                  },
                },
              },
            },
          },
          "404": {
            description: "Attempt not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/leaderboard": {
      get: {
        tags: ["Leaderboard"],
        summary: "Get leaderboard",
        description: "Returns a list of registered users. Defaults to top 50.",
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", default: 50, maximum: 100 },
            description: "Number of users to return (max 100)",
          },
        ],
        responses: {
          "200": {
            description: "Leaderboard data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    leaderboard: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string", nullable: true },
                          image: { type: "string", nullable: true },
                          email: { type: "string" },
                        },
                      },
                    },
                    total: { type: "integer", example: 42 },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/lessons": {
      get: {
        tags: ["Lessons"],
        summary: "Get all lessons",
        description: "Returns lesson curriculum organized by units. Filter by language using the `lang` query param.",
        parameters: [
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"] },
            description: "Language code to filter lessons",
          },
        ],
        responses: {
          "200": {
            description: "Lesson curriculum grouped by language",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { lessons: { type: "object", description: "Keyed by language code" } },
                },
              },
            },
          },
          "400": {
            description: "Invalid language",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/lessons/{id}": {
      get: {
        tags: ["Lessons"],
        summary: "Get lesson by ID",
        description: "Returns a specific lesson's metadata and its quiz questions.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"], default: "ja" },
            description: "Language code for the lesson",
          },
        ],
        responses: {
          "200": {
            description: "Lesson with quiz",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    lesson: { $ref: "#/components/schemas/LessonMeta" },
                    quiz: {
                      type: "object",
                      nullable: true,
                      properties: {
                        title: { type: "string" },
                        xp: { type: "number" },
                        questions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              question: { type: "string" },
                              options: { type: "array", items: { type: "string" } },
                              answer: {
                                type: "integer",
                                description: "Index of the correct option (0-based)",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid language",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          "404": {
            description: "Lesson not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/flashcards/{lang}": {
      get: {
        tags: ["Flashcards"],
        summary: "Get flashcard deck",
        description: "Returns all flashcards for a given language.",
        parameters: [
          {
            name: "lang",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"] },
            example: "ja",
          },
        ],
        responses: {
          "200": {
            description: "Flashcard deck",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    lang: { type: "string", example: "ja" },
                    cards: { type: "array", items: { $ref: "#/components/schemas/Flashcard" } },
                    total: { type: "integer", example: 6 },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid language",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },

    "/api/vocabulary/{lang}": {
      get: {
        tags: ["Vocabulary"],
        summary: "Get vocabulary list",
        description:
          "Returns vocabulary words for a given language with optional filters by category or known status.",
        parameters: [
          {
            name: "lang",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["ja", "en", "es", "fr"] },
            example: "ja",
          },
          {
            name: "category",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["Nouns", "Verbs", "Adjectives"] },
            description: "Filter by word category",
          },
          {
            name: "known",
            in: "query",
            required: false,
            schema: { type: "boolean" },
            description: "Filter by known status (true = known, false = still learning)",
          },
        ],
        responses: {
          "200": {
            description: "Vocabulary list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    lang: { type: "string", example: "ja" },
                    words: { type: "array", items: { $ref: "#/components/schemas/VocabWord" } },
                    total: { type: "integer", example: 12 },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid language",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
