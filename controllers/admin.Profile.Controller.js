import { adminModel } from "../models/model.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenAdminSecret = process.env.ADMIN_JWT_SECRET;
const refreshTokenAdminSecret = process.env.ADMIN_REFRESH_TOKEN_SECRET;

//POST:register admin endpoint
const registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const role = "admin";

    //validate input fields
    if (!email) {
      return res.json({ message: "email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "Password is required and must be 6 characters minimum",
      });
    }
    //check if email already registerd
    const existingEmail = await adminModel.findOne({ email });

    if (existingEmail) {
      return res.json({ message: "Email alredy registerd" });
    }
    //Hash password
    const hashedPassword = await hashPassword(password);

    //create a new admin
    const admin = await adminModel.create({
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({ message: "Registerd Successfully", admin });
  } catch (error) {
    next(error);
    console.log(error, "error for register");
    res.status(500).json({ message: "Internal server error" });
  }
};

//POST :login admin endpoint
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);

    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "Password is required and minimum 6 charecters needed",
      });
    }

    // Check if the vendor is already registered
    const existingAdmin = await adminModel.findOne({ email });

    if (!existingAdmin) {
      return res.json({ message: "Admin not found" });
    }

    // Check if the password is a match
    const passwordMatch = await comparePassword(
      password,
      existingAdmin.password
    );

    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const accessTokenAdmin = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: "admin",
      },
      accessTokenAdminSecret,
      { expiresIn: "1d" }
    );
    // generate REFRESH TOKEN
    const refreshTokenAdmin = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: "admin",
      },
      refreshTokenAdminSecret,
      { expiresIn: "30d" }
    );

    // Set the token as a cookie in the response
    res.cookie("accessTokenAdmin", accessTokenAdmin, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshTokenAdmin", refreshTokenAdmin, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Set the access token in the response header
    res.setHeader("authorization", `Bearer ${accessTokenAdmin}`);

    return res.status(200).json({
      message: "Login successful",
      _id: existingAdmin._id,
      email: existingAdmin.email,
      accessTokenAdmin: accessTokenAdmin,
      refreshTokenAdmin: refreshTokenAdmin,
    });
  } catch (error) {
    next(error);
    console.log(error, "login failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET: adminProfile
const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.adminId;

    // Retrieve admin profile from the database
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Exclude sensitive information from the response if needed
    const adminProfile = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      // Add other profile information as needed
    };

    return res
      .status(200)
      .json({ message: "Admin profile retrieved successfully", adminProfile });
  } catch (error) {
    next(error);
    console.error("Error in getAdminProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET:get vendors details
const getAllVendors = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      //Authorization
      if (!adminId) {
        return res.json({ message: "Unauthorized" });
      }

      const vendorData = await vendorModel.find();

      res
        .status(200)
        .json({ message: "Successfully fetched Vendor Data", vendorData });
    } else {
      console.log("admin not found");
    }
  } catch (error) {
    next(error);
    console.log(error, "failed the user data fetching");
  }
};

// PUT: block or unblock vendor by ID
const blockOrUnblockVendor = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;
    const { vendorId } = req.params;
    const { allow } = req.body;

    if (role === "admin") {
      // Authorization
      if (!adminId) {
        return res.json({ message: "Unauthorized" });
      }

      // Update vendor's allow status
      const updatedVendor = await vendorModel.findByIdAndUpdate(
        vendorId,
        { allow },
        { new: true }
      );

      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({ message: "Vendor updated successfully", updatedVendor });
    } else {
      console.log("Admin not found");
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error, "Failed to update the vendor");
    next(error);
  }
};


//GET :get all customers details
const getAllCustomers = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      //unauthorized
      if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      //check if already admin exists
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      //get all customers from userModel
      const customers = await userModel.find();

      res
        .status(200)
        .json({ message: "Successfully fetched userDetails", customers });
    } else {
      console.log("admin not found");
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// POST: logout admin endpoint
const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("accessTokenAdmin");
    res.clearCookie("refreshTokenAdmin");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
    console.log(error, "logout failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//POST :bloack and unbloxk
const userBlock = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const { userId } = req.params;


    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = await userModel.findById(userId);

    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the user's allow status between 'block' and 'unblock'
    userData.allow = userData.allow === 'block' ? 'unblock' : 'block';
    await userData.save();

    res.status(200).json({ message: `User ${userData.allow}ed successfully` });
  } catch (error) {
    next(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST: Delete a user
const userDelete = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const { userId } = req.params;

    
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = await userModel.findByIdAndDelete(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



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
