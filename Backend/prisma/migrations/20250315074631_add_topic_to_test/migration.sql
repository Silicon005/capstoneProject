-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
