import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3000';

const testUser = {
  email: `testuser_${Date.now()}@example.com`,
  password: 'Password123!',
};

test.describe('Clinic Management Application E2E Tests', () => {
  test('should register a new user, log in, and manage a patient', async ({ page }) => {
    
    // Step 1: Register
    await page.goto(`${baseURL}/admin/register`);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password); 
    await page.click('button[type="submit"]', { force: true });
    await page.waitForResponse('**/api/auth/register'); // Wait for API response
    await expect(page.locator('text=Registration successful! Redirecting to login...')).toBeVisible();
    await page.waitForURL(`${baseURL}/admin/login`);

    // Step 2: Log In
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // --- THE FINAL FIX ---
    // Wait for the main data request to finish before checking the page.
    // This is the most reliable way to know the page is ready.
    await page.waitForResponse('**/api/patients');

    await expect(page.locator('h1')).toHaveText('Patient Management');

    // Step 3: Patient Management (CRUD)
    const uniquePatientName = `John Doe ${Date.now()}`;
    const newPatient = { name: uniquePatientName, phone: '1234567890' };
    const updatedPatientName = `John Doe Smith ${Date.now()}`;

    // Create
    await page.fill('input[name="name"]', newPatient.name);
    await page.fill('input[name="phone"]', newPatient.phone);
    await page.selectOption('select[name="gender"]', 'Male');
    await page.click('button:has-text("Save Patient")');
    await expect(page.locator(`text=${newPatient.name}`)).toBeVisible();

    // Update
    await page.locator(`tr:has-text("${newPatient.name}")`).getByRole('link', { name: 'Edit' }).click();
    await page.waitForURL(/.*\/edit/);
    await page.fill('input[name="name"]', updatedPatientName);
    await page.click('button:has-text("Update Patient")');
    await expect(page.locator(`text=${updatedPatientName}`)).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept()); 
    await page.locator(`tr:has-text("${updatedPatientName}")`).getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator(`text=${updatedPatientName}`)).not.toBeVisible();
  });
});