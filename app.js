import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/admin.Route.js";
import errorMiddleware from "./middleware/error.Middleware.js";
import userRoute from "./routes/user.Route.js"

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.options("*", cors());

// databse connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("database connected.....");
  })
  .catch((error) => {
    console.log(error, "database disconnected.....");
  });

app.get('/', (req, res) => {
    res.send('pong 🏓')
})


//ROUTING
app.use("/api/v3/booking/admin", adminRoute);
app.use("/api/v3/booking/user", userRoute);
app.use(errorMiddleware);

//Server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server connected PORT ${PORT}`);
});
