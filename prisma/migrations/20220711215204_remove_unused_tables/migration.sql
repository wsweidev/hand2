/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `Example`;

-- DropTable
DROP TABLE `Product`;
