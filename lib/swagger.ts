// lib/swagger.ts
// Central OpenAPI spec for all Task API endpoints

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Task API",
    version: "1.0.0",
    description: "API documentation for Task management endpoints",
  },
  servers: [
    {
      url: "/api",
      description: "Local API server",
    },
  ],
  paths: {
    "/task/{id}": {
      get: {
        summary: "Get task by ID",
        description: "Returns the detail of a specific task by its ID.",
        tags: ["Task"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the task",
            schema: { type: "string", example: "1" },
          },
        ],
        responses: {
          "200": {
            description: "Success - Task found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "task title" },
                    description: { type: "string", example: "task description" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Error - Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Task not found" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update task by ID",
        description: "Updates the title and/or description of an existing task.",
        tags: ["Task"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the task to update",
            schema: { type: "string", example: "1" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "updated title" },
                  description: { type: "string", example: "updated description" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success - Task updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "updated title" },
                    description: { type: "string", example: "updated description" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Error - Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Task not found" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete task by ID",
        description: "Deletes a specific task by its ID.",
        tags: ["Task"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the task to delete",
            schema: { type: "string", example: "1" },
          },
        ],
        responses: {
          "200": {
            description: "Success - Task deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Task deleted successfully" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Error - Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Task not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/task": {
      post: {
        summary: "Create a new task",
        description: "Creates a new task. The 'title' field is required.",
        tags: ["Task"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "task title" },
                  description: { type: "string", example: "task description" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Success - Task created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "task title" },
                    description: { type: "string", example: "task description" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Error - Missing required field",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Missing Field: title is required" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};