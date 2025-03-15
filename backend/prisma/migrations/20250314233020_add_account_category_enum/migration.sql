/*
  Warnings:

  - You are about to drop the column `contactId` on the `Account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_contactId_key";

-- DropIndex
DROP INDEX "Contact_accountId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "contactId";
