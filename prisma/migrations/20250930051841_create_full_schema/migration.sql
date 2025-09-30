/*
  Warnings:

  - You are about to drop the column `chiefComplaint` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `generals` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `mind` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `observations` on the `Visit` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clinicId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "symptoms" TEXT,
    "diagnosis" TEXT,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "paymentMode" TEXT NOT NULL DEFAULT 'NONE',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Visit_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Visit" ("clinicId", "createdAt", "date", "fee", "id", "paid", "patientId", "paymentMode", "status", "updatedAt") SELECT "clinicId", "createdAt", "date", "fee", "id", "paid", "patientId", "paymentMode", "status", "updatedAt" FROM "Visit";
DROP TABLE "Visit";
ALTER TABLE "new_Visit" RENAME TO "Visit";
CREATE INDEX "Visit_date_idx" ON "Visit"("date");
CREATE INDEX "Visit_clinicId_date_idx" ON "Visit"("clinicId", "date");
CREATE INDEX "Visit_patientId_date_idx" ON "Visit"("patientId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
