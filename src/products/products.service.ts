import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async createProduct(data: any): Promise<Product> {
        return this.prisma.product.create({ data });
    }

    async getProductById(productId: number): Promise<Product> {
        return this.prisma.product.findUnique({ where: { productId } });
    }

    async getProducts() {
        return this.prisma.product.findMany();
    }

    async updateProduct(productId: number, data: any) {
        return this.prisma.product.update({ where: { productId }, data });
    }

    async deleteProduct(productId: number) {
        return this.prisma.product.delete({ where: { productId } });
    }
}
