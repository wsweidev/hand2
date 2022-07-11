/*
  Warnings:

  - You are about to alter the column `mainImageUrl` on the `Listing` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `LongText`.

*/
-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';
