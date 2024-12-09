/*
  Warnings:

  - You are about to drop the column `projectId` on the `notification` table. All the data in the column will be lost.
  - Added the required column `uri` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_projectId_fkey`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `projectId`,
    ADD COLUMN `uri` VARCHAR(191) NOT NULL;
