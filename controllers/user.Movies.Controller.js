import { adminModel } from "../models/model.js";
import cloudinary from "../cloudinary/cloudinary.js";
import { object } from "twilio/lib/base/serialize.js";

//GET:category
const userGetCategory = async (req, res, next) => {
    try {
      // Fetch admin data from the database
      const adminData = await adminModel.findOne(); 
  
      // If no admin data found, return 404
      if (!adminData) {
        return res.status(404).json({ message: "No admin data found" });
      }
  
      // Extract categories from admin data
      const categories = adminData.category;
  
      // If no categories found, return 404
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "No categories found" });
      }
  
      // If categories found, return 200 with categories
      res.status(200).json({ message: "Successfully retrieved categories", categories });
    } catch (error) {
      next(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

//GET:subcategories

const userGetSubCategory = async (req, res, next) => {
  try {
    // Fetch categories from the database
    const adminData = await adminModel.findOne()

    const subCategories =adminData.subCategories
    // If no categories found, return 404
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "No subCategories found" });
    }

    // If categories found, return 200 with categories
    res
      .status(200)
      .json({ message: "Successfully retrieved subCategories", subCategories });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET:movies
const userGetCategoryMovies = async (req, res, next) => {
  try {
    // Fetch categories from the database
    const adminData = await adminModel.findOne()

    const allMovies =adminData.movies
    // If no categories found, return 404
    if (!allMovies || allMovies.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }

    
    // Create an object to store movies grouped by category
    const moviesByCategory = {};
    // Iterate over the movies array
    allMovies.map((movie) => {
      // Check if the category exists in moviesByCategory object
      if (!moviesByCategory[movie.categoryName]) {
        // If the category doesn't exist, create a new category array
        moviesByCategory[movie.categoryName] = [];
      }
      // Push the movie into the corresponding category array
      moviesByCategory[movie.categoryName].push({
        title: movie.title,
        description: movie.description,
        image: movie.image,
        categoryId:movie.categoryId,
        categoryName: movie.categoryName,
        subCategoryId:movie.subCategoryId,
        subCategory: movie.subCategory,
      });
    });
    // Convert moviesByCategory object to an array of objects
    const moviesArray = Object.keys(moviesByCategory).map((categoryName) => ({
      category: categoryName,
      movies: moviesByCategory[categoryName],
    }));

    // Return the array of objects as the response
    res
      .status(200)
      .json({
        message: "Successfully retrieved movies by category",
        movies: moviesArray,
      });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { userGetCategory, userGetSubCategory, userGetCategoryMovies };
