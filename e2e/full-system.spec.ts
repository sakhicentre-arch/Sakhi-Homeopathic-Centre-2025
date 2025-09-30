import { test, expect } from '@playwright/test';

test('Full System E2E Test: Auth, Remedy CRUD, and Patient/Visit/Prescription Flow', async ({ page }) => {
  const uniqueId = Date.now();
  const userName = `testuser_${uniqueId}`;
  const userEmail = `${userName}@example.com`;
  const userPassword = 'password123';

  const remedyName = `TestRemedy ${uniqueId}`;
  const updatedRemedyName = `UpdatedRemedy ${uniqueId}`;

  const patientName = `Jane Doe ${uniqueId}`;
  const patientPhone = `+1${String(uniqueId).slice(0, 10)}`;


  // --- 1. Authentication Flow ---
  await test.step('User Registration and Login', async () => {
    // Register
    await page.goto('http://localhost:3000/admin/register');
    await page.getByLabel('Name').fill(userName);
    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Register' }).click();

    // Assert redirection to login
    await expect(page).toHaveURL('http://localhost:3000/admin/login');
    await expect(page.getByText('Registration successful!')).toBeVisible();

    // Login
    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert redirection to dashboard
    await expect(page).toHaveURL('http://localhost:3000/admin/patients');
    await expect(page.getByRole('heading', { name: 'Patient Registry' })).toBeVisible();
  });


  // --- 2. Remedy Management (CRUD) Flow ---
  await test.step('Remedy Management (Create, Read, Update, Delete)', async () => {
    // Navigate to Remedies page
    await page.getByRole('link', { name: 'Remedies' }).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/remedies');
    await expect(page.getByRole('heading', { name: 'Remedy Master List' })).toBeVisible();

    // Create a new remedy
    await page.getByLabel('Remedy Name').fill(remedyName);
    await page.getByRole('button', { name: 'Add Remedy' }).click();

    // Assert the new remedy is in the list
    await expect(page.getByRole('cell', { name: remedyName, exact: true })).toBeVisible();

    // Find and click the Edit link for the new remedy
    const remedyRow = page.getByRole('row', { name: new RegExp(remedyName) });
    await remedyRow.getByRole('link', { name: 'Edit' }).click();
    
    // Update the remedy name
    await expect(page).toHaveURL(/.*\/admin\/remedies\/.*\/edit/);
    await page.getByLabel('Remedy Name').fill(updatedRemedyName);
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Assert the updated name is now in the list
    await expect(page).toHaveURL('http://localhost:3000/admin/remedies');
    await expect(page.getByRole('cell', { name: updatedRemedyName, exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: remedyName, exact: true })).not.toBeVisible();

    // Set up a handler for the delete confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Find and click the Delete button for the updated remedy
    const updatedRemedyRow = page.getByRole('row', { name: new RegExp(updatedRemedyName) });
    await updatedRemedyRow.getByRole('button', { name: 'Delete' }).click();

    // Assert the remedy is no longer in the list
    await expect(page.getByRole('cell', { name: updatedRemedyName, exact: true })).not.toBeVisible();
  });


  // --- 3. Full Patient, Visit, and Prescription Flow ---
  await test.step('Patient, Visit, and Prescription Flow', async () => {
    // This step requires a remedy to exist for the prescription.
    // We'll re-create one for the purpose of this part of the test.
    const prescriptionRemedy = `Aconite ${uniqueId}`;
    await page.getByLabel('Remedy Name').fill(prescriptionRemedy);
    await page.getByRole('button', { name: 'Add Remedy' }).click();
    await expect(page.getByRole('cell', { name: prescriptionRemedy, exact: true })).toBeVisible();

    // Navigate back to Patients page
    await page.getByRole('link', { name: 'Patients' }).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/patients');

    // Create a new patient
    await page.getByLabel('Patient Name').fill(patientName);
    await page.getByLabel('Phone Number').fill(patientPhone);
    await page.getByRole('button', { name: 'Add Patient' }).click();

    // Assert the new patient is in the registry
    await expect(page.getByRole('cell', { name: patientName, exact: true })).toBeVisible();

    // Click to view the new patient's detail page
    await page.getByRole('link', { name: patientName, exact: true }).click();
    await expect(page).toHaveURL(/.*\/admin\/patients\/.*/);
    await expect(page.getByRole('heading', { name: patientName })).toBeVisible();

    // Add a new visit/consultation
    await page.getByRole('button', { name: 'Add New Visit' }).click();
    await expect(page.getByRole('heading', { name: 'New Consultation' })).toBeVisible();
    
    // Fill out the consultation form (a simple observation)
    const observationText = 'Patient seems calm and composed.';
    await page.locator('textarea[name="observations.entry"]').fill(observationText);
    await page.getByRole('button', { name: 'Save Consultation' }).click();

    // Assert the new visit appears in the history
    await expect(page.getByText(observationText)).toBeVisible();
    // A more robust selector for the specific visit item
    const visitHistoryItem = page.locator('div').filter({ hasText: new RegExp(`Visit on.*${observationText}`) }).first();
    await expect(visitHistoryItem).toBeVisible();

    // Write/Edit a prescription for the new visit
    await visitHistoryItem.getByRole('button', { name: 'Write/Edit Prescription' }).click();
    
    // Fill out and save the prescription form in the modal
    await expect(page.getByRole('heading', { name: 'Prescription' })).toBeVisible();
    await page.getByLabel('Remedy').selectOption({ label: prescriptionRemedy });
    await page.getByLabel('Potency').fill('200C');
    await page.getByLabel('Dosage').fill('4 pills, 3 times a day');
    await page.getByRole('button', { name: 'Save Prescription' }).click();

    // Assert the modal is closed and prescription details are visible
    await expect(page.getByRole('heading', { name: 'Prescription' })).not.toBeVisible();
    await expect(visitHistoryItem).toContainText(prescriptionRemedy);
    await expect(visitHistoryItem).toContainText('200C');
    await expect(visitHistoryItem).toContainText('4 pills, 3 times a day');
  });
});
