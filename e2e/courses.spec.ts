import { test, expect } from '@playwright/test';

test.describe('Educational Core Flow (Firebase Emulator)', () => {
  
  // Create a user first before testing courses
  test.beforeEach(async ({ page }) => {
    // 1. Register a test user for the course tests
    await page.goto('/register');
    const testEmail = `student-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', 'Estudiante E2E');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('TS-E2E-04: should search for a course and enroll successfully', async ({ page }) => {
    // 1. Navigate to courses catalog
    await page.goto('/courses');
    await expect(page.getByText('Catálogo de Cursos')).toBeVisible();

    // 2. Search for a specific course
    await page.fill('input[type="search"]', 'n8n');
    
    // Click on "Ver detalles" of the first matched course
    await page.click('text="Ver detalles"');

    // 3. We should be on the course detail page
    await expect(page).toHaveURL(/\/courses\/.+/);
    
    // Verify "Inscribirse ahora" button is visible
    const enrollBtn = page.getByRole('button', { name: /Inscribirse ahora/i });
    await expect(enrollBtn).toBeVisible();

    // 4. Enroll
    await enrollBtn.click();

    // 5. Verify success state
    await expect(page.getByText('¡Inscripción exitosa!').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Continuar Aprendiendo/i })).toBeVisible();
  });

  test('TS-E2E-05: should mark a lesson as complete and update progress', async ({ page }) => {
    // Navigate directly to a specific course detail page (using mock data c-001)
    await page.goto('/courses/c-001');

    // Wait for the auth context to initialize (mock loading delay)
    await page.waitForTimeout(1500);

    // Enroll first
    await page.click('text="Inscribirse ahora"');
    
    // Wait for the 'Continuar Aprendiendo' link
    const continueBtn = page.getByRole('link', { name: /Continuar Aprendiendo/i });
    await expect(continueBtn).toBeVisible();

    // Go to lesson
    await continueBtn.click();
    await expect(page).toHaveURL(/\/courses\/c-001\/lessons\/.+/);

    // Verify initial progress is 0%
    await expect(page.getByText('0%').first()).toBeVisible();

    // Click 'Marcar como Completada'
    await page.click('text="Marcar como Completada"');

    // Verify success toast
    await expect(page.getByText('¡Lección Completada!').first()).toBeVisible();

    // Verify progress updated to 10%
    await expect(page.getByText('10%').first()).toBeVisible();
    await expect(page.getByText('Completada', { exact: true }).first()).toBeVisible();
  });
});
