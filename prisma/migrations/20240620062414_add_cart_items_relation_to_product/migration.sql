/*
  Warnings:

  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN "total" FLOAT DEFAULT 0 NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL;
