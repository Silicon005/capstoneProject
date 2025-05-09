/*
  Warnings:

  - Made the column `topicId` on table `Test` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_topicId_fkey";

-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "topicId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
