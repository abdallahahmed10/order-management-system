import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      address: '123 Main St'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      address: '456 Elm St'
    }
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 10.0,
      stock: 100
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 20.0,
      stock: 200
    }
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.userId,
      status: 'Pending',
      total: 30.0,
      orderItems: {
        create: [
          { productId: product1.productId, quantity: 1 },
          { productId: product2.productId, quantity: 1 }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.userId,
      status: 'Completed',
      total: 20.0,
      orderItems: {
        create: [
          { productId: product2.productId, quantity: 1 }
        ]
      }
    }
  });

  // Create carts
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.userId,
      cartItems: {
        create: [
          { productId: product1.productId, quantity: 2 },
          { productId: product2.productId, quantity: 3 }
        ]
      }
    }
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.userId,
      cartItems: {
        create: [
          { productId: product2.productId, quantity: 1 }
        ]
      }
    }
  });

  console.log({ user1, user2, product1, product2, order1, order2, cart1, cart2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
