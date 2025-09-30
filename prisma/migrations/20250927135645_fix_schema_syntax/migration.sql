/*
  Warnings:

  - You are about to drop the `Diagnosis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Symptom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `endHour` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PrescriptionItem` table. All the data in the column will be lost.
  - Added the required column `remedyId` to the `PrescriptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Diagnosis_visitId_key";

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN "diagnosis" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Diagnosis";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Symptom";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Remedy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clinic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Clinic" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Clinic";
DROP TABLE "Clinic";
ALTER TABLE "new_Clinic" RENAME TO "Clinic";
CREATE TABLE "new_PrescriptionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "visitId" INTEGER NOT NULL,
    "remedyId" INTEGER NOT NULL,
    "potency" TEXT,
    "dose" TEXT,
    "notes" TEXT,
    CONSTRAINT "PrescriptionItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrescriptionItem_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "Remedy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PrescriptionItem" ("dose", "id", "notes", "potency", "visitId") SELECT "dose", "id", "notes", "potency", "visitId" FROM "PrescriptionItem";
DROP TABLE "PrescriptionItem";
ALTER TABLE "new_PrescriptionItem" RENAME TO "PrescriptionItem";
CREATE INDEX "PrescriptionItem_visitId_idx" ON "PrescriptionItem"("visitId");
CREATE INDEX "PrescriptionItem_remedyId_idx" ON "PrescriptionItem"("remedyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Remedy_name_key" ON "Remedy"("name");
