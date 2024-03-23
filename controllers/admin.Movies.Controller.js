import { adminModel } from "../models/model.js";
import cloudinary from "../cloudinary/cloudinary.js";

// POST: Add category endpoint
const addCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Check if admin is authenticated
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Create a new category
      const newCategory = {
        title,
      };

      // Add the new category to the admin's categories array
      existingAdmin.category.push(newCategory);

      // Save the updated admin document
      await existingAdmin.save();

      res.status(201).json({
        message: "Category added successfully",
        category: newCategory,
      });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// GET: Get all categories
const getCategories = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Fetch all categories from the adminModel
      const categories = existingAdmin.category;

      res
        .status(200)
        .json({ message: "Categories successfully fetched", categories });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update category endpoint
const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { title } = req.body;
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find the category to update
    const categoryToUpdate = existingAdmin.category.id(categoryId);

    if (!categoryToUpdate) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category details
    categoryToUpdate.title = title;

    // Save the updated admin document
    await existingAdmin.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: categoryToUpdate,
    });
  } catch (error) {
    next(error);
    console.error("Error in updateCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete category endpoint
const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find and remove the category
    existingAdmin.category.pull({ _id: categoryId });

    // Save the updated admin document
    await existingAdmin.save();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
    console.error("Error in deleteCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST: Add subcategory endpoint
const addSubcategories = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Check if admin is authenticated
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Create a new category
      const newSubcategory = {
        title,
      };

      // Add the new category to the admin's categories array
      existingAdmin.subCategories.push(newSubcategory);

      // Save the updated admin document
      await existingAdmin.save();

      res.status(201).json({
        message: "Category added successfully",
        category: newSubcategory,
      });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get all subcategories endpoint
const getSubcategories = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Retrieve subcategories from the admin document
      const subcategories = existingAdmin.subCategories;

      res.status(200).json({
        message: "Subcategories successfully fetched",
        subcategories,
      });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in getSubcategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: Update subcategory endpoint
const updateSubcategory = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { subcategoryId } = req.params;
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Find the subcategory by ID
      const subcategory = existingAdmin.subCategories.find(
        (sub) => sub._id.toString() === subcategoryId.toString()
      );

      if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      // Update the subcategory title
      subcategory.title = title;

      // Save the updated admin document
      await existingAdmin.save();

      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory,
      });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in updateSubcategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Delete subcategory endpoint
const deleteSubcategory = async (req, res, next) => {
  try {
    const { subcategoryId } = req.params;
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Filter out the subcategory to delete
      existingAdmin.subCategories = existingAdmin.subCategories.filter(
        (sub) => sub._id.toString() !== subcategoryId.toString()
      );

      // Save the updated admin document
      await existingAdmin.save();

      res.status(200).json({
        message: "Subcategory deleted successfully",
      });
    } else {
      return res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in deleteSubcategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// POST: admin add movies
const addMovies = async (req, res, next) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { title, description } = req.body;
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if existingAdmin has the category property
    if (!existingAdmin.category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the category by categoryId
    const category = existingAdmin.category.find(cat => cat._id.toString() === categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the subcategory by subcategoryId
    const subcategory = existingAdmin.subCategories.find(sub => sub._id.toString() === subcategoryId);
    
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

    // Create a new movie
    const newMovie = {
      title,
      description,
      image: secure_url,
      categoryId: category._id,
      categoryName: category.title,
      subCategory: subcategory.title,
      subCategoryId: subcategoryId,
    };

    // Add the new movie to the admin's movies array
    existingAdmin.movies.push(newMovie);

    // Save the updated admin document
    await existingAdmin.save();

    res.status(201).json({
      message: "Movie added successfully",
      movie: newMovie,
    });
  } catch (error) {
    next(error);
    console.error("Error in addMovies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// GET: Get all movies
const getMovies = async (req, res, next) => {
  try {
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Fetch all movies from the adminModel
    const moviesList = existingAdmin.movies;

    res
      .status(200)
      .json({ message: "Movies successfully fetched", moviesList });
  } catch (error) {
    next(error);
    console.error("Error in getMovies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update movie endpoint
const updateMovie = async (req, res, next) => {
  try {
    const { movieId, categoryId, subcategoryId } = req.params;
    const { title, description } = req.body;
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find the movie to update
    const movieToUpdate = existingAdmin.movies.id(movieId);

    if (!movieToUpdate) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Update the movie details
    movieToUpdate.title = title;
    movieToUpdate.description = description;

    // If categoryId and subcategoryId are provided, update them
    if (categoryId && subcategoryId) {
      // Find the category by categoryId
      const category = existingAdmin.category.id(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Find the subcategory by subcategoryId
      const subcategory = category.subCategories.id(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      // Update movie's category and subcategory details
      movieToUpdate.categoryId = categoryId;
      movieToUpdate.categoryName = category.title;
      movieToUpdate.subCategory = subcategory.title;
      movieToUpdate.subCategoryId = subcategoryId;
    }

    // Save the updated admin document
    await existingAdmin.save();

    res.status(200).json({
      message: "Movie updated successfully",
      movie: movieToUpdate,
    });
  } catch (error) {
    next(error);
    console.error("Error in updateMovie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete movie endpoint
const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const adminId = req.adminId;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find and remove the movie
    existingAdmin.movies.pull({ _id: movieId });

    // Save the updated admin document
    await existingAdmin.save();

    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    next(error);
    console.error("Error in deleteMovie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  addSubcategories,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
  addMovies,
  getMovies,
  updateMovie,
  deleteMovie,
};
