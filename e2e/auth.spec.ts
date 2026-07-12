import { test, expect } from '@playwright/test';

test.describe('Auth Flow & Protected Routes (Firebase Emulator)', () => {

  test('TS-E2E-03: should protect dashboard route from unauthenticated users', async ({ page }) => {
    // Si intentamos entrar al dashboard sin sesión, debe mandarnos al login
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('TS-E2E-01: should allow a user to register, view dashboard, and logout', async ({ page }) => {
    await page.goto('/register');

    const testEmail = `test-${Date.now()}@example.com`;
    const testPass = 'password123';

    await page.fill('input[name="name"]', 'Usuario E2E');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPass);
    
    // Register
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Welcome message should be visible
    await expect(page.getByText(/Bienvenido, Usuario E2E/i)).toBeVisible();

    // Logout
    await page.click('button:has-text("Cerrar sesión")');

    // Should redirect back to login
    await expect(page).toHaveURL(/.*\/login/);

    // Now test login with the newly created account
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPass);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard again
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show validation errors on invalid login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'correo-invalido');
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/correo válido/i)).toBeVisible();
    await expect(page.getByText(/al menos 6 caracteres/i)).toBeVisible();
  });
});
