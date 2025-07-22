const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const placeOrder = async (req, res) => {
  const userId = req.user.userId;
  const { items } = req.body;

  if (!userId) {
    return res.status(403).json({ error: "User ID not found in token" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items must be a non-empty array" });
  }

  try {
    console.log('Incoming items:', items);

    // Check product stock before placing order
    for (let item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          create: items.map(item => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Reduce stock for each product
    for (let item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    const formatted = orders.map(order => ({
      order_id: order.id,
      created_at: order.createdAt,
      items: order.items.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json({ success: true, orders: formatted });
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  placeOrder,
  getOrders,
};
