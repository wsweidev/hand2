/*
  Warnings:

  - Made the column `receiverId` on table `ChatMessage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderId` on table `ChatMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ChatMessage` MODIFY `receiverId` VARCHAR(191) NOT NULL,
    MODIFY `senderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';
