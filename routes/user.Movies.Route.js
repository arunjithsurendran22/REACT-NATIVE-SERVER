import {
  userGetCategory,
  userGetSubCategory,
  userGetCategoryMovies,
} from "../controllers/controller.js";
import express from "express";
const router = express.Router();

//admin add category
router.get("/category/get", userGetCategory);
router.get("/subCategory/get", userGetSubCategory);
router.get("/movie-by-category/get", userGetCategoryMovies);

export default router;
