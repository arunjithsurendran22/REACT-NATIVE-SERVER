import express from "express";
import adminProfileRoute from "./admin.Profile.Route.js";
import adminMoviesRoute from "./admin.Movies.Route.js";
const router = express.Router();

const defaultRoutes = [
  {
    path: "/profile",
    route: adminProfileRoute,
  },
  {
    path: "/movies",
    route: adminMoviesRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
