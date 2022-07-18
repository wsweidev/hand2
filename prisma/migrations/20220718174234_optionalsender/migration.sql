-- AlterTable
ALTER TABLE `ChatMessage` MODIFY `receiverId` VARCHAR(191) NULL,
    MODIFY `senderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Listing` MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';
