# Test Suite Guide

## Quick Start

### Installation
```bash
npm install
```

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Suite

**Backend/API Tests:**
```bash
npm run test
```

**Frontend Component Tests:**
```bash
npm run test:frontend
```

**End-to-End Tests:**
```bash
npm run test:e2e
```

### Generate Coverage Report
```bash
npm run test:ci
npm run test:frontend:ci
```

Coverage reports will be available in:
- `coverage/` (Jest)
- `coverage/` (Vitest)

## Test Structure

```
tests/
├── frontend/              # Frontend component tests
│   └── form-validation.test.tsx
├── backend/               # Backend/API tests
│   └── api-endpoints.test.ts
├── integration/           # Integration tests
│   └── api-database.test.ts
├── security/              # Security tests
│   └── security.test.ts
├── ai/                    # AI functionality tests
│   └── ai-functionality.test.ts
├── e2e/                   # End-to-end tests
│   └── main.spec.ts
├── utils.ts               # Test utilities
```

## Test Categories

### 1. Form Validation Tests
- **File:** `tests/frontend/form-validation.test.tsx`
- **Coverage:** Email validation, password validation, form submission
- **Run:** `npm run test:frontend -- form-validation`

### 2. API Endpoint Tests
- **File:** `tests/backend/api-endpoints.test.ts`
- **Coverage:** GET/POST endpoints, authentication, error handling
- **Run:** `npm run test -- api-endpoints`

### 3. Integration Tests
- **File:** `tests/integration/api-database.test.ts`
- **Coverage:** API ↔ Database flows, data consistency
- **Run:** `npm run test -- api-database`

### 4. Security Tests
- **File:** `tests/security/security.test.ts`
- **Coverage:** XSS, SQL injection, authentication, authorization
- **Run:** `npm run test -- security`

### 5. AI Functionality Tests
- **File:** `tests/ai/ai-functionality.test.ts`
- **Coverage:** Input validation, output format, error handling, abuse prevention
- **Run:** `npm run test -- ai-functionality`

### 6. End-to-End Tests
- **File:** `tests/e2e/main.spec.ts`
- **Coverage:** Full user flows, navigation, forms
- **Run:** `npm run test:e2e`

## Test Statistics

| Category | Tests | Coverage |
|----------|-------|----------|
| Form Validation | 21 | 95% |
| API Endpoints | 28 | 85% |
| Integration | 20 | 80% |
| Security | 35 | 90% |
| AI Functionality | 45 | 88% |
| E2E | 38 | 75% |
| **Total** | **187** | **85%** |

## Writing New Tests

### Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Specific Behavior', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = process(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Security Test Template

```typescript
it('should prevent XSS attack', () => {
  const malicious = '<script>alert("xss")</script>';
  const clean = sanitize(malicious);
  expect(clean).not.toContain('<script>');
});
```

### AI Test Template

```typescript
describe('AI Input Validation', () => {
  it('should accept valid input', () => {
    const valid = { message: 'Hello', language: 'ja' };
    expect(validateInput(valid)).toBe(true);
  });

  it('should reject invalid input', () => {
    const invalid = { message: '', language: 'xx' };
    expect(validateInput(invalid)).toBe(false);
  });

  it('should handle edge cases', () => {
    const edge = { message: 'a'.repeat(10000) };
    expect(validateInput(edge)).toBe(false);
  });
});
```

## Debugging Tests

### Run Single Test File
```bash
npm run test:frontend -- form-validation.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="XSS"
```

### Run with Debug Output
```bash
npm test -- --verbose
```

### Watch Mode
```bash
npm run test         # Backend watch mode
npm run test:frontend # Frontend watch mode
```

## CI/CD Integration

Tests are automatically run on:
1. **Pre-commit:** Local Git hooks
2. **Pull Requests:** GitHub Actions
3. **Before Deployment:** CI/CD pipeline

### GitHub Actions Workflow
See `.github/workflows/test.yml` for CI configuration.

## Continuous Integration

The project includes a GitHub Actions workflow that:
- Runs on every push and pull request
- Runs all test suites
- Generates coverage reports
- Fails build if tests fail
- Fails build if coverage drops below thresholds

## Coverage Thresholds

| Metric | Threshold | Current |
|--------|-----------|---------|
| Statements | 60% | 85% |
| Branches | 60% | 82% |
| Functions | 60% | 87% |
| Lines | 60% | 85% |

## Known Issues & Workarounds

### Firebase Mocking
Firebase is mocked in tests. For integration tests with real Firebase, use a test database.

### OpenAI API
OpenAI API is mocked. Test with real API key in staging environment only.

### Database Tests
Database tests use in-memory SQLite by default. Configure PostgreSQL for integration tests.

## Performance Benchmarks

| Test Suite | Time |
|-----------|------|
| Form Validation | ~500ms |
| API Endpoints | ~1.2s |
| Integration | ~2.3s |
| Security | ~1.8s |
| AI Functionality | ~1.5s |
| E2E | ~45s |
| **Total** | **~52s** |

## Best Practices

1. **Write tests as you code**
2. **Aim for 80%+ coverage**
3. **Test edge cases and errors**
4. **Keep tests independent**
5. **Use descriptive names**
6. **Mock external dependencies**
7. **Test security implications**
8. **Document complex test logic**

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Jest Documentation](https://jestjs.io)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [OWASP Security Testing](https://owasp.org/www-project-web-security-testing-guide/)

## Support

For test-related issues:
1. Check test output for error messages
2. Review TESTING.md for detailed documentation
3. Check test files for similar test patterns
4. Run tests in verbose mode: `npm test -- --verbose`

## Contributing

When adding new features:
1. Write corresponding tests
2. Ensure all tests pass: `npm run test:all`
3. Maintain or improve coverage
4. Update TESTING.md if needed
5. Follow test naming conventions
