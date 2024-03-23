import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  category: [
    {
      title: {
        type: String,
      },
    },
  ],
  subCategories: [
    {
      title: {
        type: String,
      },
    },
  ],
  movies: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
      },
      categoryId: {
        type: String,
      },
      categoryName: {
        type: String,
      },
      subCategory: {
        type: String,
      },
      subCategoryId: {
        type: String,
      },
    },
  ],
  coupon: [
    {
      title: {
        type: String,
      },
      percentage: {
        type: Number,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      expireDateTime: {
        type: Date,
      },
    },
  ],
});

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
