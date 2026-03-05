export const spec = {
  openapi: "3.0.0", // This is the version field the error was asking for
  info: {
    title: "Linguiny API",
    version: "1.0.0",
    description: "API documentation for my assignment",
  },
  paths: {
    "/api/login": {
      post: {
        summary: "User Login",
        responses: {
          200: { description: "Success" }
        }
      }
    }
  }
}
