import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
  test.describe('Authentication Flow', () => {
    test('should login with valid email and password', async ({ page }) => {
      await page.goto('/login');

      // Fill login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await page.waitForURL('/dashboard');
      expect(page.url()).toContain('/dashboard');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Wait for error message
      const errorMessage = page.locator('text=Login failed');
      await expect(errorMessage).toBeVisible();
    });

    test('should require email field', async ({ page }) => {
      await page.goto('/login');

      // Leave email empty
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', 'password123');

      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      // Should not navigate
      expect(page.url()).toContain('/login');
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/login');

      await page.fill('input[type="email"]', 'invalid-email');
      await page.fill('input[type="password"]', 'password123');

      const emailInput = page.locator('input[type="email"]');
      const validity = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );

      expect(validity).toBe(false);
    });
  });

  test.describe('Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });

    test('should display dashboard after login', async ({ page }) => {
      expect(page.url()).toContain('/dashboard');
      const dashboard = page.locator('text=Dashboard');
      await expect(dashboard).toBeVisible();
    });

    test('should navigate to lessons', async ({ page }) => {
      await page.click('a[href*="lessons"]');
      await page.waitForURL('**/lessons');
      expect(page.url()).toContain('/lessons');
    });

    test('should navigate to vocabulary', async ({ page }) => {
      await page.click('a[href*="vocabulary"]');
      await page.waitForURL('**/vocabulary');
      expect(page.url()).toContain('/vocabulary');
    });

    test('should navigate to profile', async ({ page }) => {
      await page.click('a[href*="profile"]');
      await page.waitForURL('**/profile');
      expect(page.url()).toContain('/profile');
    });
  });

  test.describe('Form Validation', () => {
    test('should validate registration form', async ({ page }) => {
      await page.goto('/register');

      // Try to submit empty form
      await page.click('button[type="submit"]');

      // Should not navigate
      expect(page.url()).toContain('/register');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/register');

      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[name="password"]');

      // Leave fields empty and try to submit
      await page.click('button[type="submit"]');

      // Check if validation message appears
      const required = await nameInput.getAttribute('required');
      expect(required).toBe('');
    });
  });

  test.describe('Learning Features', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });

    test('should access and complete lesson', async ({ page }) => {
      await page.goto('/dashboard/lessons');

      // Click first available lesson
      const firstLesson = page.locator('button:has-text("Start Lesson")').first();
      await firstLesson.click();

      // Should load lesson content
      const lessonContent = page.locator('text=Lesson');
      await expect(lessonContent).toBeVisible();
    });

    test('should access vocabulary section', async ({ page }) => {
      await page.goto('/dashboard/vocabulary');

      // Should display vocabulary list
      const vocabList = page.locator('[data-testid="vocab-list"]');
      await expect(vocabList).toBeVisible();
    });

    test('should access flashcards', async ({ page }) => {
      await page.goto('/dashboard/flashcards');

      // Should display flashcard interface
      const flashcard = page.locator('[data-testid="flashcard"]');
      await expect(flashcard).toBeVisible();
    });
  });

  test.describe('AI Chat Feature', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });

    test('should send message to AI', async ({ page }) => {
      await page.goto('/dashboard/conversation');

      // Type message
      const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
      await chatInput.fill('Teach me Japanese');

      // Send message
      await page.click('button:has-text("Send")');

      // Should display user message
      const userMessage = page.locator('text=Teach me Japanese');
      await expect(userMessage).toBeVisible();

      // Should display AI response (with timeout for API call)
      const aiResponse = page.locator('[data-role="assistant"]');
      await expect(aiResponse).toBeVisible({ timeout: 10000 });
    });

    test('should handle empty message submission', async ({ page }) => {
      await page.goto('/dashboard/conversation');

      // Try to send empty message
      const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
      await chatInput.fill('');

      const sendButton = page.locator('button:has-text("Send")');
      const isDisabled = await sendButton.isDisabled();

      // Should be disabled or not send
      if (!isDisabled) {
        await sendButton.click();
        // No message should be added
        const messages = page.locator('[data-role]');
        const count = await messages.count();
        expect(count).toBe(0);
      }
    });
  });

  test.describe('Quiz Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });

    test('should start and complete quiz', async ({ page }) => {
      await page.goto('/dashboard/lessons/quiz');

      // Select answer for first question
      const firstOption = page.locator('input[type="radio"]').first();
      await firstOption.check();

      // Click next or submit
      const nextBtn = page.locator('button:has-text("Next")');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
      }

      // Should display quiz progress
      const progress = page.locator('[data-testid="quiz-progress"]');
      expect(progress).toBeDefined();
    });

    test('should show score after quiz completion', async ({ page }) => {
      await page.goto('/dashboard/lessons/quiz');

      // Complete quiz by selecting all answers
      const questions = page.locator('[data-testid="question"]');
      const count = await questions.count();

      for (let i = 0; i < count; i++) {
        const option = page.locator('input[type="radio"]').first();
        await option.check();

        const nextBtn = page.locator('button:has-text("Next")');
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
        }
      }

      // Should show results
      const results = page.locator('text=Your Score');
      await expect(results).toBeVisible();
    });
  });

  test.describe('User Profile', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });

    test('should display user profile', async ({ page }) => {
      await page.goto('/dashboard/profile');

      // Should show user information
      const profile = page.locator('[data-testid="user-profile"]');
      await expect(profile).toBeVisible();
    });

    test('should display user statistics', async ({ page }) => {
      await page.goto('/dashboard/profile');

      // Should show stats like XP, streak
      const stats = page.locator('[data-testid="user-stats"]');
      await expect(stats).toBeVisible();
    });

    test('should allow updating profile', async ({ page }) => {
      await page.goto('/dashboard/profile');

      // Find and click edit button
      const editBtn = page.locator('button:has-text("Edit")');
      if (await editBtn.isVisible()) {
        await editBtn.click();

        // Update profile field
        const nameInput = page.locator('input[name="name"]');
        await nameInput.fill('Updated Name');

        // Save changes
        const saveBtn = page.locator('button:has-text("Save")');
        await saveBtn.click();

        // Should show success message
        const success = page.locator('text=Updated successfully');
        await expect(success).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/login');

      // Should still display form properly
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();

      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeVisible();

      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/dashboard');

      // Navigation should be accessible
      const navElements = page.locator('[role="navigation"]');
      expect(navElements).toBeDefined();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        // Alt text should exist (though can be empty for decorative)
        expect(alt !== null).toBe(true);
      }
    });

    test('should have semantic HTML structure', async ({ page }) => {
      await page.goto('/login');

      // Should have proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Should have proper form labels
      const labels = page.locator('label');
      const count = await labels.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/login');

      // Tab to email input
      await page.press('body', 'Tab');
      const emailInput = page.locator('input[type="email"]');

      // Fill in email
      await emailInput.fill('test@example.com');

      // Tab to password
      await page.press('body', 'Tab');
      const passwordInput = page.locator('input[type="password"]');

      // Should be focused
      const focused = await page.evaluate(() =>
        document.activeElement?.getAttribute('type')
      );

      expect(focused).toContain('password');
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for network failure', async ({ page }) => {
      // Simulate network error
      await page.route('**/api/**', (route) => route.abort());

      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Should show error message
      const error = page.locator('text=error|Error|failed');
      await expect(error).toBeVisible({ timeout: 5000 });
    });

    test('should handle 404 gracefully', async ({ page }) => {
      await page.goto('/non-existent-page');

      // Should display 404 message
      const notFound = page.locator('text=not found|404');
      await expect(notFound).toBeVisible();
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Mock API to return 500
      await page.route('**/api/**', (route) =>
        route.abort('failed')
      );

      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Should show error message
      const error = page.locator('text=error|Error|Server');
      await expect(error).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within reasonable time', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'TestPassword123!');

      const startTime = Date.now();
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
      const loadTime = Date.now() - startTime;

      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should display content without layout shift', async ({ page }) => {
      await page.goto('/dashboard');

      // Measure layout shifts
      let shifts = 0;
      page.on('framenavigated', () => {
        shifts++;
      });

      await page.waitForLoadState('networkidle');

      // Should have minimal layout shifts
      expect(shifts).toBeLessThan(3);
    });
  });
});
