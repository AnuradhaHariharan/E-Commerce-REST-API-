const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};