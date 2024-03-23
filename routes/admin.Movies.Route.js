import {
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
} from "../controllers/controller.js";
import express from "express";
import { adminAuthorization } from "../middleware/admin.Auth.Middleware.js";
import { uploading } from "../multer/multer.js";
const router = express.Router();

//admin add category
router.post("/add-category/add", adminAuthorization, addCategory);
router.get("/add-category/get", adminAuthorization, getCategories);
router.put("/add-category/edit/:categoryId", adminAuthorization, updateCategory);
router.delete("/add-category/delete/:categoryId", adminAuthorization, deleteCategory);


//admin addsubcategories
router.post("/add-subcategory/add", adminAuthorization, addSubcategories);
router.get("/add-subcategory/get", adminAuthorization, getSubcategories);
router.put("/add-subcategory/edit/:subcategoryId", adminAuthorization, updateSubcategory);
router.delete("/add-subcategory/delete/:subcategoryId", adminAuthorization, deleteSubcategory);

//admin add movies
router.post("/add-movies/add/:categoryId/:subcategoryId", adminAuthorization, uploading ,addMovies);
router.get("/add-movies/get", adminAuthorization, getMovies);
router.put("/add-movies/edit/:movieId/:categoryId/:subcategoryId", adminAuthorization, uploading, updateMovie);
router.delete("/add-movies/delete/movieId", adminAuthorization, deleteMovie);

export default router;
