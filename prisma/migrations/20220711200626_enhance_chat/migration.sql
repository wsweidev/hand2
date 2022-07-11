/*
  Warnings:

  - You are about to drop the column `chatId` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChatMessage` DROP COLUMN `chatId`,
    DROP COLUMN `userId`,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';

-- DropTable
DROP TABLE `Chat`;

-- DropTable
DROP TABLE `_ChatToUser`;
