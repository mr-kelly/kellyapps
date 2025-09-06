/*
  Warnings:

  - Changed the type of `sourceType` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frequency` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `outputFormat` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timezone` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('url', 'keyword', 'ticker');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('daily', 'weekly', 'realtime');

-- CreateEnum
CREATE TYPE "OutputFormat" AS ENUM ('summary', 'pdf', 'ppt');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'zh_HK');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('HKT', 'ET');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('done_today', 'scheduled', 'error');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "sourceType",
ADD COLUMN     "sourceType" "SourceType" NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL,
DROP COLUMN "outputFormat",
ADD COLUMN     "outputFormat" "OutputFormat" NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
DROP COLUMN "timezone",
ADD COLUMN     "timezone" "Timezone" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL;
