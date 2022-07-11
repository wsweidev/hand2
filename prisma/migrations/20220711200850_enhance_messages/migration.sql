/*
  Warnings:

  - Added the required column `message` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChatMessage` ADD COLUMN `message` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';
