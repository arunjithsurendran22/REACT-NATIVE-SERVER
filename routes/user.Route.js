import express from "express";
import userMovieRoute from "./user.Movies.Route.js";
const router = express.Router();

const defaultRoutes = [
  {
    path: "/movies",
    route: userMovieRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
