/*
  Warnings:

  - You are about to drop the column `profileImageUrls` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImageUrls",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "birthday" SET NOT NULL;
