const express = require("express");
const validate = require("../../../middlewares/validate");
const jobPostValidation = require("./jobpost.validation");
const jobPostController = require("./jobpost.controller");
const auth = require("../../../middlewares/auth");
const router = express.Router();

router.post(
  "/postjob",
  auth(),
  validate(jobPostValidation.jobPostApi),
  jobPostController.jobPostApi
);
router.post(
  "/editjob",
  auth(),
  validate(jobPostValidation.editPostApi),
  jobPostController.editPostApi
);
router.get("/getjobs", auth(), jobPostController.getJobPost);

router.post(
    "/adddesignation",
    auth(),
    validate(jobPostValidation.addDesignation),
    jobPostController.addDesignation
  );
  router.post(
    "/editdesignation",
    auth(),
    validate(jobPostValidation.editDesignation),
    jobPostController.editDesignation
  );
  router.get(
    "/getdesignation",
    auth(),
    jobPostController.getDesignation
  );



module.exports = router;
