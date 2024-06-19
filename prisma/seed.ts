import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password1',
      address: '123 Main St',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password2',
      address: '456 Elm St',
    },
  });

  // Create some products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product A',
      description: 'Description for product A',
      price: 19.99,
      stock: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product B',
      description: 'Description for product B',
      price: 29.99,
      stock: 200,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Product C',
      description: 'Description for product C',
      price: 39.99,
      stock: 300,
    },
  });

  // Add products to a cart
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.userId,
      cartItems: {
        create: [
          { productId: product1.productId, quantity: 2 },
          { productId: product2.productId, quantity: 1 },
        ],
      },
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.userId,
      cartItems: {
        create: [
          { productId: product2.productId, quantity: 3 },
          { productId: product3.productId, quantity: 1 },
        ],
      },
    },
  });

  // Create some orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.userId,
      orderDate: new Date(),
      status: 'Pending',
      orderItems: {
        create: [
          { productId: product1.productId, quantity: 2 },
          { productId: product2.productId, quantity: 1 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.userId,
      orderDate: new Date(),
      status: 'Completed',
      orderItems: {
        create: [
          { productId: product2.productId, quantity: 3 },
          { productId: product3.productId, quantity: 1 },
        ],
      },
    },
  });

  console.log({ user1, user2, product1, product2, product3, cart1, cart2, order1, order2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
