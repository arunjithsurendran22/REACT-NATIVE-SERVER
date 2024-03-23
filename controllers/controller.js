//import admin profile

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  blockOrUnblockVendor,
  logoutAdmin,
  userBlock,
  userDelete,
} from "./admin.Profile.Controller.js";

export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  blockOrUnblockVendor,
  logoutAdmin,
  userBlock,
  userDelete,
};

//add category
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
} from "./admin.Movies.Controller.js";

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

import {
  userGetCategory,
  userGetSubCategory,
  userGetCategoryMovies,
} from "./user.Movies.Controller.js";

export { userGetCategory, userGetSubCategory, userGetCategoryMovies };
