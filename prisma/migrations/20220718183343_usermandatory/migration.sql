/*
  Warnings:

  - Made the column `userId` on table `Listing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Listing` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';
