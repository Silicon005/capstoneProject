/*
  Warnings:

  - Made the column `correctAnswer` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "correctAnswer" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;
