const prisma = require('../prisma/client');

exports.getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

const cloudinary = require('../utils/cloudinary');

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;
  const imageUrl = req.file?.path || '';
  const userId = req.user.userId;

  if (!userId) {
    return res.status(403).json({ error: "User ID not found in token" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image: imageUrl,
        categoryId,
        userId, // associate the product with the user (admin or not)
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id }, // ✅ just pass the string id
      data: {
        name,
        description,
        price: parseFloat(price),
        image:imageUrl, // ✅ match with schema (not `imageUrl`)
        category
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Product deleted' });
};

exports.getFilteredProducts = async (req, res) => {
  const {
    minPrice,
    maxPrice,
    categoryId,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {};

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.gte = parseFloat(minPrice);
    if (maxPrice) filters.price.lte = parseFloat(maxPrice);
  }

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  if (search) {
    filters.name = {
      contains: search,
      mode: 'insensitive', // case-insensitive
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.product.count({ where: filters }),
    ]);

    res.json({
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      products,
    });
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
