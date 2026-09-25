import mongoose from 'mongoose';
import Product from '../models/Product.js';

// GET /api/products
export async function getProducts(request, response) {
  try {
    const { category, search } = request.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: 1 });
    return response.json({
      success: true,
      count: products.length,
      products,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
}

// GET /api/products/:id (supports ObjectId or slug)
export async function getProductById(request, response) {
  try {
    const { id } = request.params;
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return response.json({
      success: true,
      product,
      data: product
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
}

// POST /api/products (Admin only)
export async function createProduct(request, response) {
  try {
    const { slug, name, price, category, description, image, nutrition, available } = request.body;

    if (!name || price === undefined || !category) {
      return response.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    const generatedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const existing = await Product.findOne({ slug: generatedSlug });
    if (existing) {
      return response.status(409).json({
        success: false,
        message: `Product with slug '${generatedSlug}' already exists`
      });
    }

    const product = await Product.create({
      slug: generatedSlug,
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      description: description ? description.trim() : undefined,
      image,
      nutrition: nutrition || { calories: '120 kcal', protein: '6g', carbs: '18g', fat: '6g' },
      available: available !== undefined ? Boolean(available) : true
    });

    return response.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
      data: product
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
}

// PUT /api/products/:id (Admin only)
export async function updateProduct(request, response) {
  try {
    const { id } = request.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const { slug, name, price, category, description, image, nutrition, available } = request.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) {
      const numPrice = Number(price);
      if (Number.isNaN(numPrice) || numPrice < 0) {
        return response.status(400).json({ success: false, message: 'Price must be a non-negative number' });
      }
      updates.price = numPrice;
    }
    if (category !== undefined) updates.category = category.trim();
    if (description !== undefined) updates.description = description.trim();
    if (image !== undefined) updates.image = image;
    if (nutrition !== undefined && typeof nutrition === 'object') updates.nutrition = nutrition;
    if (available !== undefined) updates.available = Boolean(available);
    if (slug !== undefined) updates.slug = slug.trim().toLowerCase();

    const updated = await Product.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return response.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return response.json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
      data: updated
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
}

// DELETE /api/products/:id (Admin only)
export async function deleteProduct(request, response) {
  try {
    const { id } = request.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return response.json({
      success: true,
      message: 'Product deleted successfully',
      data: deleted
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
}

