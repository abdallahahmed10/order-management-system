import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    
    async createUser(data: User): Promise<User> {
        return this.prisma.user.create({ data });
    }
    
    async getUserById(userId: number): Promise<User> {
        return this.prisma.user.findUnique({ where: { userId } });
    }
    
    async getUsers() {
        return this.prisma.user.findMany();
    }
    
    async updateUser(userId: number, data: User) {
        return this.prisma.user.update({ where: { userId }, data });
    }
    
    async deleteUser(userId: number) {
        return this.prisma.user.delete({ where: { userId } });
        
    }
    async findUserById(userId: number): Promise<User> {
        return this.prisma.user.findUnique({
          where: { userId },
        });
      }
}
