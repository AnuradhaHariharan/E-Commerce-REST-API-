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
  const { name, description, price, category } = req.body;

  let imageUrl = req.file?.path || '';
  console.log(imageUrl);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      image: imageUrl,
      category
    },
  });

  res.status(201).json(product);
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
        image, // ✅ match with schema (not `imageUrl`)
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
