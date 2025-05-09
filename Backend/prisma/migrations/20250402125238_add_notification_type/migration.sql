-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CREATED_TEST', 'ADMIN_NOTIFICATION', 'CREATED_COURSE', 'COURSE_ENROLLED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
