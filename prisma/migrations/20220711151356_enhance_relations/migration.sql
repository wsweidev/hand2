-- AlterTable
ALTER TABLE `ChatMessage` ADD COLUMN `mentionedListingId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Listing` ADD COLUMN `highestBidderId` VARCHAR(191) NULL,
    ADD COLUMN `soldToId` VARCHAR(191) NULL,
    MODIFY `mainImageUrl` LONGTEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Transaction` MODIFY `listingId` VARCHAR(191) NULL;
