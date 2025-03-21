const express = require("express");
const authRoute=require("./v1/auth/auth.route")
const userDetailsRoute=require("./v1/users/user.route")
const jobPostUser=require("./v1/jobpostcompany/jobpost.route")
const jobApplied=require("./v1/job/job.route")

const router = express.Router();
const defaultRoutes = [
  {
    path: "/v1/auth",
    route: authRoute,
  },
  {
    path: "/v1/user",
    route: userDetailsRoute,
  },
  {
    path: "/v1/jobpost",
    route: jobPostUser,
  },
  {
    path: "/v1/job",
    route: jobApplied,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
