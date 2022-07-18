/*
  Warnings:

  - You are about to alter the column `wallet` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `User` MODIFY `wallet` DOUBLE NOT NULL DEFAULT 0;
