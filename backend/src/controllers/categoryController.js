import mongoose from 'mongoose';
import Category from '../models/Category.js';

// GET /api/categories
export async function getCategories(_request, response) {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    return response.json({
      success: true,
      count: categories.length,
      categories,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
}

// GET /api/categories/:id
export async function getCategoryById(request, response) {
  try {
    const { id } = request.params;
    let category;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    } else {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return response.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return response.json({
      success: true,
      category,
      data: category
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
}

// POST /api/categories (Admin only)
export async function createCategory(request, response) {
  try {
    const { name, slug, order } = request.body;

    if (!name) {
      return response.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const generatedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: generatedSlug }]
    });

    if (existing) {
      return response.status(409).json({
        success: false,
        message: 'A category with this name or slug already exists'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      order: order !== undefined ? Number(order) : 0
    });

    return response.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
      data: category
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
}

// PUT /api/categories/:id (Admin only)
export async function updateCategory(request, response) {
  try {
    const { id } = request.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const { name, slug, order } = request.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (slug !== undefined) updates.slug = slug.trim().toLowerCase();
    if (order !== undefined) {
      const numOrder = Number(order);
      if (!Number.isNaN(numOrder)) updates.order = numOrder;
    }

    const updated = await Category.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return response.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return response.json({
      success: true,
      message: 'Category updated successfully',
      category: updated,
      data: updated
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
}

// DELETE /api/categories/:id (Admin only)
export async function deleteCategory(request, response) {
  try {
    const { id } = request.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const deleted = await Category.findOneAndDelete(query);
    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return response.json({
      success: true,
      message: 'Category deleted successfully',
      data: deleted
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
}

