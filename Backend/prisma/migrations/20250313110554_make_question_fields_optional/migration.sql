-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'DIRECT_ANSWER');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctAnswer" TEXT,
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "type" "QuestionType";
